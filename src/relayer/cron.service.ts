import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WithdrawalQueueService } from "./services/withdrawalQueueService";
import { ConfigService } from "./services/configService";
import { PrismaService } from "./services/prismaService";
import { Web3Number } from "@strkfarm/sdk";
import { Account, Call, Contract, RpcProvider, TransactionExecutionStatus, uint256 } from 'starknet';
import { getNetwork, TryCatchAsync } from "../common/utils";
import { NotifService } from "./services/notifService";
import { LSTService } from './services/lstService';
import { fetchQuotes } from '@avnu/avnu-sdk';
import { getAddresses } from '../common/constants';

function getCronSettings(action: 'process-withdraw-queue') {
  const config = new ConfigService();
  switch(action) {
    case 'process-withdraw-queue':
      return config.isSepolia() ? CronExpression.EVERY_5_MINUTES : CronExpression.EVERY_HOUR;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  readonly config: ConfigService;
  readonly withdrawalQueueService: WithdrawalQueueService;
  readonly prismaService: PrismaService;
  readonly notifService: NotifService;
  readonly lstService: LSTService;
  arbContract: Contract | null;

  constructor(
    config: ConfigService,
    withdrawalQueueService: WithdrawalQueueService,
    prismaService: PrismaService,
    lstService: LSTService,
    notifService: NotifService,
  ) {
    this.config = config;
    this.withdrawalQueueService = withdrawalQueueService;
    this.prismaService = prismaService;
    this.lstService = lstService;
    this.notifService = notifService;
  }

  // Run the same task on startup
  @TryCatchAsync()
  async onModuleInit() {
    console.log('Running task on application start...');
    
    // set up arb contract
    const provider = this.config.get("provider");
    const ARB_ADDR = getAddresses(getNetwork()).ARB_CONTRACT
    const cls = await provider.getClassAt(ARB_ADDR);
    this.arbContract = new Contract(cls.abi, ARB_ADDR, provider as any);

    await this.processWithdrawQueue();
    await this.sendStats();
    await this.checkAndExecuteArbitrage();
    await this.stakeFunds();
  }

  @Cron(getCronSettings('process-withdraw-queue'))
  @TryCatchAsync()
  async processWithdrawQueue() {
    this.logger.log('Running processWithdrawQueue task');

    await this.withdrawToWQ();
    // note update this to 0.01 STRK later
    const min_amount = new Web3Number("0.01", 18);

    // get pending withdrawals
    const [pendingWithdrawals, rejected_ids] = await this.prismaService.getPendingWithdraws(min_amount);
    this.logger.debug(`Found ${pendingWithdrawals.length} pending withdrawals`);

    // load account
    const account: Account = this.config.get("account");
    const provider: RpcProvider = this.config.get("provider");
    
    let balanceLeft = await this.withdrawalQueueService.getSTRKBalance();
    this.logger.log(`Balance left: ${balanceLeft.toString()}`);

    // claim withdrawals
    // send 10 at a time
    const MAX_WITHDRAWALS = 10;
    for (let i = 0; i < pendingWithdrawals.length; i += MAX_WITHDRAWALS) {
      const batch = pendingWithdrawals.slice(i, i + MAX_WITHDRAWALS);
      this.logger.log(`Claiming ${batch.length} withdrawals from ${i} to ${i + MAX_WITHDRAWALS-1}`);

      // loop and generate SN Call objects
      const calls: Call[] = [];
      for (const w of batch) {
        const amount_strk = Web3Number.fromWei(w.amount_strk, 18);
        if (amount_strk.lte(balanceLeft)) {
          this.logger.debug(`Claiming withdrawal ID#${w.request_id} with amount ${amount_strk.toString()}`);
          const call = this.withdrawalQueueService.getClaimWithdrawalCall(w.request_id);
          calls.push(call);
          balanceLeft = balanceLeft.minus(amount_strk.toString());
        } else {
          // We skip the rest of the withdrawals if we don't have enough balance now
          this.logger.warn(`Skipping withdrawal >= ID#${w.request_id} due to insufficient balance`);
          this.logger.warn(`request amount: ${amount_strk.toString()}`);
          break;
        }
      }

      // if no withdrawals to claim, break entire loop
      if (calls.length === 0) {
        this.logger.warn(`No withdrawals to claim`);
        break;
      }

      // send transactions to claim withdrawals
      // note: nonce is set to 'pending' to get the next nonce
      const nonce = await account.getNonce('pending')
      this.logger.debug(`Claiming ${calls.length} withdrawals with nonce ${nonce}`);
      const res = await account.execute(calls, {
        nonce: nonce,
      });
      this.notifService.sendMessage(`Claimed ${res.transaction_hash} withdrawals`);
      await provider.waitForTransaction(res.transaction_hash);
      this.notifService.sendMessage(`Transaction ${res.transaction_hash} confirmed`);

      // if less than MAX_WITHDRAWALS, break entire loop as there are no more withdrawals to claim
      if (calls.length < MAX_WITHDRAWALS) {
        this.logger.warn(`No more withdrawals to claim`);
        break;
      }
    }

    this.logger.log(`Rejected ${rejected_ids.length} withdrawals`);
    this.logger.log(`Completed processWithdrawQueue task`);
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  @TryCatchAsync()
  async sendStats() {
    const [pending_withdrawals, rejected_ids] = await this.prismaService.getPendingWithdraws(new Web3Number("0.0", 18));
    const balanceLeft = await this.withdrawalQueueService.getSTRKBalance();
    const stats = await this.withdrawalQueueService.getWithdrawalQueueState();
    this.notifService.sendMessage(`Pending Withdrawals: ${pending_withdrawals.length}, min ID: ${pending_withdrawals[0]?.request_id || 'N/A'}`);
    this.notifService.sendMessage(`Rejected ${rejected_ids.length} withdrawals`);
    this.notifService.sendMessage(`Balance left: ${balanceLeft.toString()}`);
    this.notifService.sendMessage(`Withdrawal Queue State: \n
      Max Request ID: ${stats.max_request_id}\n
      Unprocessed Withdraw Queue Amount: ${stats.unprocessed_withdraw_queue_amount.toString()} STRK\n
      Intransit Amount: ${stats.intransit_amount.toString()} STRK\n
    `);
  }

  async withdrawToWQ() {
    const wqState = await this.withdrawalQueueService.getWithdrawalQueueState();

    const balanceAmount = await this.lstService.getSTRKBalance();
    this.logger.log('LST Balance amount: ', balanceAmount.toString());
    const requiredAmount = wqState.unprocessed_withdraw_queue_amount;
    this.logger.log('WQ Required amount: ', requiredAmount.toString());

    if (balanceAmount.gt(0) && requiredAmount.gt(0)) {
        const transferAmount = balanceAmount.lt(requiredAmount) ? balanceAmount : requiredAmount;
        this.logger.log('transferAmount: ', transferAmount.toString())
        await this.lstService.sendToWithdrawQueue(transferAmount);
    } else {
      if (balanceAmount.lte(0)) {
        this.logger.log('No balance to send to WQ');
      } else if (requiredAmount.lte(0)) {
        this.logger.log('No required amount in WQ');
      }
    }
  }

  @Cron("0 30 */6 * * *")
  @TryCatchAsync()
  async stakeFunds() {
    let amount = await this.lstService.bulkStake();
    if (amount)
      this.notifService.sendMessage(`Staked ${amount} STRK`);
    else 
      this.notifService.sendMessage(`No STRK to stake`);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  @TryCatchAsync()
  async checkAndExecuteArbitrage() {
    const strkBalanceLST = await this.lstService.getSTRKBalance();
    const account: Account = this.config.get("account");
    let queueStats = await this.withdrawalQueueService.getWithdrawalQueueState();
    let pendingAmount = queueStats.unprocessed_withdraw_queue_amount;
    this.logger.log(`Pending amount: ${pendingAmount.toString()} STRK`);

    const availableAmount = strkBalanceLST.minus(pendingAmount.toString());
    this.logger.log(`Available amount: ${availableAmount.toString()} STRK`);
    const exchangeRate =  await this.lstService.exchangeRate();
    this.logger.log(`Exchange rate: ${exchangeRate}`);

    const ADDRESSES = getAddresses(getNetwork());
    const availableAmountNum = Number(availableAmount.toString()) * 0.95; // max use 95% of amount
    for (let i = 0; i < 10; i++) {
      if (availableAmountNum > 1000) {
        let amount = Math.floor(availableAmountNum * (10 - i - 1) / 10);
        this.logger.log(`Checking arb for ${amount.toString()} STRK`);
        let amount_str = new Web3Number(amount, 18).toWei();
        console.log(amount_str);
        const params: any = {
          sellTokenAddress: ADDRESSES.Strk,
          buyTokenAddress: ADDRESSES.LST,
          sellAmount: amount_str,
          takerAddress: ADDRESSES.ARB_CONTRACT,
        }
        const quotes = await fetchQuotes(params);
        if (quotes.length == 0) {
          continue;
        }
        let amountOut = Web3Number.fromWei(quotes[0].buyAmount.toString(), 18);
        let equivalentAmount = Number(amountOut.toString()) * exchangeRate;
        this.logger.log(`Equivalent amount (STRK): ${equivalentAmount}`);
        const potentialProfit = equivalentAmount - amount;
        this.logger.log(`Potential profit: ${potentialProfit}`);

        const shouldExecuteCond1 = equivalentAmount > amount && potentialProfit > 5; // min profit 5 STRK
        const shouldExecuteCond2 = (potentialProfit / amount) > 0.002; // min profit % of 0.2%, avoid order matching large amounts for small arbitrage
        if (shouldExecuteCond1 && shouldExecuteCond2) { // min profit 5 STRK
          this.logger.log(`Executing swap for ${amount.toString()} STRK`);
          await this.executeArb(new Web3Number(amount, 18));
          this.notifService.sendMessage(`Potential profit: ${potentialProfit.toFixed(2)} STRK`);
          return;
        } else if (shouldExecuteCond2) {
          this.logger.log(`Potential profit is less than 5 STRK: ${potentialProfit.toFixed(2)} / ${amount.toFixed(2)}}`);
        } else {
          this.logger.log(`Potential profit % is less than 0.2%: ${(potentialProfit / amount).toFixed(4)}, more info: ${potentialProfit.toFixed(2)} / ${amount.toFixed(2)}}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  async executeArb(amount: Web3Number) {
    const call = this.arbContract.populate('buy_xstrk', {
      params: {
        amount: {
          mag: amount.toWei(),
          sign: 0,
        },
        is_token1: true,
        sqrt_ratio_limit: uint256.bnToUint256('487383972438908925075196475773716407478'), // 2 price (bahur time he)
        skip_ahead: false
      },
      receiver: '0x06bF0f343605525d3AeA70b55160e42505b0Ac567B04FD9FC3d2d42fdCd2eE45' // treasury arb (VT holds)
    })
    const account = this.config.get('account');
    const provider = this.config.get('provider');
    const tx = await account.execute([call]);
    this.logger.log('Performing arb: tx', tx.transaction_hash);
    await provider.waitForTransaction(tx.transaction_hash, {
      successStates: [TransactionExecutionStatus.SUCCEEDED]
    })
    this.logger.log('Arb tx confirmed');
    this.notifService.sendMessage(`Arb tx confirmed: ${tx.transaction_hash} with amount ${amount.toString()} STRK`);
  }
}
