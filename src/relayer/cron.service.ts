import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WithdrawalQueueService } from "./services/withdrawalQueueService";
import { ConfigService } from "./services/configService";
import { PrismaService } from "./services/prismaService";
import { Web3Number } from "@strkfarm/sdk";
import { Account, Call, RpcProvider } from 'starknet';
import { TryCatchAsync } from "../common/utils";
import { NotifService } from "./services/notifService";
import { LSTService } from './services/lstService';

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
    await this.processWithdrawQueue();
    await this.sendStats();
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
    const balanceRes = await this.withdrawalQueueService.getSTRKBalance();
    const balanceLeft = Web3Number.fromWei(balanceRes.toString(), 18);
    const stats = await this.withdrawalQueueService.getWithdrawalQueueState();
    this.notifService.sendMessage(`Pending Withdrawals: ${pending_withdrawals.length}`);
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

}