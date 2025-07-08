import assert from 'assert';

import { fetchBuildExecuteTransaction, fetchQuotes, QuoteRequest } from '@avnu/avnu-sdk';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Web3Number } from '@strkfarm/sdk';
import {
  Account,
  Call,
  Contract,
  RpcProvider,
  TransactionExecutionStatus,
  Uint256,
  uint256,
} from 'starknet';

import { prisma } from '../../prisma/client';
import { getAddresses, getLSTDecimals, Network } from '../common/constants';
import { BotService } from '../common/services/bot.service';
import { getNetwork, TryCatchAsync } from '../common/utils';
import { populateEkuboTimeseries } from '../points-system/standalone-scripts/populate-ekubo-timeseries';
import { ConfigService } from './services/configService';
import { DelegatorService } from './services/delegatorService';
import { LSTService } from './services/lstService';
import { NotifService } from './services/notifService';
import { PrismaService } from './services/prismaService';
import { WithdrawalQueueService } from './services/withdrawalQueueService';

function getCronSettings(action: 'process-withdraw-queue') {
  const config = new ConfigService();
  switch (action) {
    case 'process-withdraw-queue':
      return config.isSepolia() ? CronExpression.EVERY_5_MINUTES : CronExpression.EVERY_HOUR;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

interface Route {
  token_from: string;
  token_to: string;
  exchange_address: string;
  percent: number;
  additional_swap_params: string[];
}

interface SwapInfo {
  token_from_address: string;
  token_from_amount: Uint256;
  token_to_address: string;
  token_to_amount: Uint256;
  token_to_min_amount: Uint256;
  beneficiary: string;
  integrator_fee_amount_bps: number;
  integrator_fee_recipient: string;
  routes: Route[];
}

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly botService = new BotService();
  readonly config: ConfigService;
  readonly withdrawalQueueService: WithdrawalQueueService;
  readonly delegatorService: DelegatorService;
  readonly prismaService: PrismaService;
  readonly notifService: NotifService;
  readonly lstService: LSTService;
  arbContract: Contract | null = null;

  constructor(
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => WithdrawalQueueService))
    withdrawalQueueService: WithdrawalQueueService,
    @Inject(forwardRef(() => DelegatorService))
    delegatorService: DelegatorService,
    @Inject(forwardRef(() => PrismaService))
    prismaService: PrismaService,
    @Inject(forwardRef(() => LSTService))
    lstService: LSTService,
    @Inject(forwardRef(() => NotifService))
    notifService: NotifService,
    @Inject(forwardRef(() => BotService))
    botService: BotService,
  ) {
    this.config = config;
    this.withdrawalQueueService = withdrawalQueueService;
    this.delegatorService = delegatorService;
    this.prismaService = prismaService;
    this.lstService = lstService;
    this.notifService = notifService;
    this.botService = botService;
  }

  // Run the same task on startup
  @TryCatchAsync()
  async onModuleInit() {
    console.log('Running task on application start...');

    // set up arb contract
    if (getNetwork() == Network.mainnet) {
      const provider = this.config.get('provider');
      const ARB_ADDR = getAddresses(getNetwork()).ARB_CONTRACT;
      const cls = await provider.getClassAt(ARB_ADDR);
      this.arbContract = new Contract(cls.abi, ARB_ADDR, provider as any);
    }

    // Run on init
    await this.processWithdrawQueue();
    await this.sendStats();
    // await this.checkAndExecuteArbitrage();

    // Just for testing
    // await this.stakeFunds();
    // await this.updateEkuboPositionsTimeseries();
    // await this.claimRewards();
    // await this.claimUnstakedFunds();
  }

  @Cron(getCronSettings('process-withdraw-queue'))
  @TryCatchAsync()
  async processWithdrawQueue() {
    this.logger.log('Running processWithdrawQueue task');

    // todo do not process withdrawals less than 30min old
    // to avoid making any inflation attack profitable

    await this.withdrawToWQ();
    // note update this to 0.01 STRK later
    const min_amount = new Web3Number('0.01', 18);

    // get pending withdrawals
    const [pendingWithdrawals, rejected_ids] =
      await this.prismaService.getPendingWithdraws(min_amount);
    this.logger.debug(`Found ${pendingWithdrawals.length} pending withdrawals`);

    // load account
    const account: Account = this.config.get('account');
    const provider: RpcProvider = this.config.get('provider');

    let balanceLeft = await this.withdrawalQueueService.getSTRKBalance();
    this.logger.log(`Balance left: ${balanceLeft.toString()}`);

    const withdrawQueueState = await this.withdrawalQueueService.getWithdrawalQueueState();
    this.logger.log(
      'cummulative amount: ',
      withdrawQueueState.cumulative_requested_amount.toString(),
    );
    this.logger.log(
      'unprocessed amount: ',
      withdrawQueueState.unprocessed_withdraw_queue_amount.toString(),
    );
    const allowedLimit = withdrawQueueState.cumulative_requested_amount.minus(
      withdrawQueueState.unprocessed_withdraw_queue_amount.toString(),
    );
    this.logger.log(`Allowed limit: ${allowedLimit.toString()}`);

    const MAX_WITHDRAWALS_PER_DAY = 2_000_000; // 2M STRK
    const processedWithdrawalsInLast24Hours = await this.prismaService.getWithdrawalsLastDay();
    let processedWithdrawalsInLast24HoursDecimalAdjusted = Number(
      processedWithdrawalsInLast24Hours / BigInt(10 ** getLSTDecimals()),
    );
    this.logger.log(
      `Processed withdrawals in last 24 hours: ${processedWithdrawalsInLast24HoursDecimalAdjusted.toString()}`,
    );

    // claim withdrawals
    // send 10 at a time
    const MAX_WITHDRAWALS = 10;
    for (let i = 0; i < pendingWithdrawals.length; i += MAX_WITHDRAWALS) {
      const batch = pendingWithdrawals.slice(i, i + MAX_WITHDRAWALS);
      this.logger.log(
        `Claiming ${batch.length} withdrawals from ${i} to ${i + MAX_WITHDRAWALS - 1}`,
      );

      // loop and generate SN Call objects
      const calls: Call[] = [];
      for (const w of batch) {
        const amount_strk = Web3Number.fromWei(w.amount_strk, 18);
        const requestCum = Web3Number.fromWei(w.cumulative_requested_amount_snapshot, 18);
        if (amount_strk.lte(balanceLeft) && requestCum.lessThanOrEqualTo(allowedLimit)) {
          this.logger.debug(
            `Claiming withdrawal ID#${w.request_id} with amount ${amount_strk.toString()}`,
          );

          // limit max automated withdrawals per day
          processedWithdrawalsInLast24HoursDecimalAdjusted += Number(amount_strk.toString());
          if (processedWithdrawalsInLast24HoursDecimalAdjusted > MAX_WITHDRAWALS_PER_DAY) {
            this.notifService.sendMessage(
              `Processed withdrawals in last 24 hours exceeded limit: ${processedWithdrawalsInLast24HoursDecimalAdjusted.toString()}`,
            );
            break;
          }

          await this.botService.sendUnstakeCompletionEvent(
            w.receiver.toString(),
            amount_strk.toString(), // amount
            'STRK', // token name
            {
              requestId: w.request_id.toString(),
              timestamp: w.timestamp,
              withdrawalQueueAddress: getAddresses(getNetwork()).WithdrawQueue,
            },
          );

          // create call object
          const call = this.withdrawalQueueService.getClaimWithdrawalCall(w.request_id);
          calls.push(call);
          balanceLeft = balanceLeft.minus(amount_strk.toString());
        } else {
          // We skip the rest of the withdrawals if we don't have enough balance now
          this.logger.warn(
            `Skipping withdrawal ID#${w.request_id} due to insufficient balance or not ready`,
          );
          this.logger.warn(
            `request amount: ${amount_strk.toString()}, req time: ${new Date(w.timestamp * 1000).toLocaleString()}`,
          );
        }
      }

      // if no withdrawals to claim, break entire loop
      if (calls.length === 0 || i + MAX_WITHDRAWALS >= pendingWithdrawals.length) {
        this.logger.warn(`No withdrawals to claim`);
        break;
      }

      // send transactions to claim withdrawals
      // note: nonce is set to 'pending' to get the next nonce
      const nonce = await account.getNonce('pending');
      this.logger.debug(`Claiming ${calls.length} withdrawals with nonce ${nonce}`);
      const res = await account.execute(calls, {
        nonce: nonce,
      });
      this.notifService.sendMessage(`Claimed ${res.transaction_hash} withdrawals`);
      await provider.waitForTransaction(res.transaction_hash);
      this.notifService.sendMessage(`Transaction ${res.transaction_hash} confirmed`);

      // if less than MAX_WITHDRAWALS, break entire loop as there are no more withdrawals to claim
      if (calls.length < MAX_WITHDRAWALS && i + MAX_WITHDRAWALS >= pendingWithdrawals.length) {
        this.logger.warn(`No more withdrawals to claim`);
        break;
      }
    }

    this.logger.log(`Rejected ${rejected_ids.length} withdrawals`);
    this.logger.log(`Completed processWithdrawQueue task`);
  }

  /**
   * @description A separate cron job to emit unstake initiation event to bot, which will only consider last 5 minutes pending withdrawals
   */
  @Cron(CronExpression.EVERY_MINUTE)
  @TryCatchAsync()
  async emitUnstakeInitiationEvent() {
    const [pending_withdrawals] = await this.prismaService.getPendingWithdraws(
      new Web3Number('0.0', 18),
    );
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const recentWithdrawals = pending_withdrawals.filter(
      (w) => w.timestamp * 1000 > twoMinutesAgo && !w.is_notified,
    );

    this.logger.log(`Found ${recentWithdrawals.length} recent unnotified withdrawals`);

    for (const w of recentWithdrawals) {
      try {
        await this.botService.sendUnstakeInitiationEvent(
          w.receiver.toString(),
          Web3Number.fromWei(w.amount_strk, 18).toString(), // amount
          'STRK', // token name
          {
            // metadata
            requestId: w.request_id.toString(),
            timestamp: w.timestamp,
            withdrawalQueueAddress: getAddresses(getNetwork()).WithdrawQueue,
          },
        );

        // Mark as notified after successful notification
        await this.prismaService.markWithdrawalAsNotified(w.request_id);
        this.logger.log(`Marked withdrawal ${w.request_id} as notified`);
      } catch (error) {
        this.logger.error(
          `Failed to send unstake initiation event for request ${w.request_id}:`,
          error,
        );
        // Don't mark as notified if sending failed, so we can retry
      }
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  @TryCatchAsync()
  async sendStats() {
    const [pending_withdrawals, rejected_ids] = await this.prismaService.getPendingWithdraws(
      new Web3Number('0.0', 18),
    );
    const balanceLeft = await this.withdrawalQueueService.getSTRKBalance();
    const stats = await this.withdrawalQueueService.getWithdrawalQueueState();
    this.notifService.sendMessage(
      `Pending Withdrawals: ${pending_withdrawals.length}, min ID: ${pending_withdrawals[0]?.request_id || 'N/A'}`,
    );
    this.notifService.sendMessage(`Rejected ${rejected_ids.length} withdrawals`);
    this.notifService.sendMessage(`Balance left: ${balanceLeft.toString()}`);
    this.notifService.sendMessage(`Withdrawal Queue State: \n
      Max Request ID: ${stats.max_request_id}\n
      Unprocessed Withdraw Queue Amount: ${stats.unprocessed_withdraw_queue_amount.toString()} STRK\n
      Intransit Amount: ${stats.intransit_amount.toString()} STRK\n
    `);
  }

  async withdrawToWQ() {
    try {
      const wqState = await this.withdrawalQueueService.getWithdrawalQueueState();

      const balanceAmount = await this.lstService.getSTRKBalance();
      this.logger.log('LST Balance amount: ', balanceAmount.toString());
      const requiredAmount = wqState.unprocessed_withdraw_queue_amount;
      this.logger.log('WQ Required amount: ', requiredAmount.toString());

      if (balanceAmount.gt(0) && requiredAmount.gt(0)) {
        const transferAmount = balanceAmount.lt(requiredAmount) ? balanceAmount : requiredAmount;
        this.logger.log('transferAmount: ', transferAmount.toString());
        await this.lstService.sendToWithdrawQueue(transferAmount);
      } else {
        if (balanceAmount.lte(0)) {
          this.logger.log('No balance to send to WQ');
        } else if (requiredAmount.lte(0)) {
          this.logger.log('No required amount in WQ');
        }
      }
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as any).message === 'string' &&
        (error as any).message.includes('Caller is missing role')
      ) {
        this.logger.warn(
          'Account does not have permission to send funds to withdraw queue. Skipping this operation.',
        );
        this.notifService.sendMessage(
          'Account missing role permissions for withdraw queue transfer',
        );
      } else {
        this.logger.error('Error in withdrawToWQ:', error);
        throw error; // Re-throw other errors
      }
    }
  }

  @Cron('0 30 */6 * * *')
  @TryCatchAsync()
  async stakeFunds() {
    const amount = await this.lstService.bulkStake();
    if (amount) this.notifService.sendMessage(`Staked ${amount} STRK`);
    else this.notifService.sendMessage(`No STRK to stake`);
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  @TryCatchAsync()
  async checkAndExecuteArbitrage() {
    if (getNetwork() != Network.mainnet) return;

    // todo modify arb contract to take flash loan from vesu and
    // execute swap using avnu swap (so that more routes can be used)
    const strkBalanceLST = await this.lstService.getSTRKBalance();
    const account: Account = this.config.get('account');
    const queueStats = await this.withdrawalQueueService.getWithdrawalQueueState();
    const pendingAmount = queueStats.unprocessed_withdraw_queue_amount;
    this.logger.log(`Pending amount: ${pendingAmount.toString()} STRK`);

    const availableAmount = strkBalanceLST.minus(pendingAmount.toString());
    this.logger.log(`Available amount: ${availableAmount.toString()} STRK`);
    const exchangeRate = await this.lstService.exchangeRate();
    this.logger.log(`Exchange rate: ${exchangeRate}`);

    const ADDRESSES = getAddresses(getNetwork());
    const availableAmountNum = Number(availableAmount.toString()) * 0.95; // max use 95% of amount

    for (let i = 0; i < 9; i++) {
      if (availableAmountNum > 1000) {
        const amount = Math.floor((availableAmountNum * (10 - i - 1)) / 10);
        this.logger.log(`Checking arb for ${amount.toString()} STRK`);
        const amount_str = new Web3Number(amount, 18).toWei();
        const params: QuoteRequest = {
          sellTokenAddress: ADDRESSES.Strk,
          buyTokenAddress: ADDRESSES.LST,
          sellAmount: BigInt(amount_str),
          takerAddress: ADDRESSES.ARB_CONTRACT,
          // excludeSources: ['Nostra', 'Haiko(Solvers)'], // cause only Ekubo is configured for now in the arb contract
        };
        const swapInfo = await this._fetchQuotes(params);
        const amountOut = swapInfo.amountOut;
        const equivalentAmount = Number(amountOut.toString()) * exchangeRate;
        this.logger.log(`Equivalent amount (STRK): ${equivalentAmount}`);
        const potentialProfit = equivalentAmount - amount;
        this.logger.log(`Potential profit: ${potentialProfit}`);

        const shouldExecuteCond1 = equivalentAmount > amount && potentialProfit > 5; // min profit 5 STRK
        const shouldExecuteCond2 = potentialProfit / amount > 0.002; // min profit % of 0.2%, avoid order matching large amounts for small arbitrage
        if (shouldExecuteCond1 && shouldExecuteCond2) {
          // min profit 5 STRK
          this.logger.log(`Executing swap for ${amount.toString()} STRK`);
          await this.executeArb(swapInfo.swapInfo);
          this.notifService.sendMessage(`Potential profit: ${potentialProfit.toFixed(2)} STRK`);
          return;
        } else if (shouldExecuteCond1) {
          this.logger.log(
            `Potential profit % is less than 0.2%: ${(potentialProfit / amount).toFixed(4)}, more info: ${potentialProfit.toFixed(2)} / ${amount.toFixed(2)}}`,
          );
        }
        //  else {
        //   this.logger.log(`Potential profit is less than 5 STRK: ${potentialProfit.toFixed(2)} / ${amount.toFixed(2)}}`);
        // }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async _fetchQuotes(
    params: QuoteRequest,
    retry = 0,
  ): Promise<{
    swapInfo: SwapInfo;
    amountOut: Web3Number;
  }> {
    const MAX_RETRY = 10;
    const quotes = await fetchQuotes(params);

    const condition1 = quotes.length > 0;
    // only ekubo, and it should be one route only
    // const condition2 = condition1 && quotes[0].routes.length == 1 && quotes[0].routes[0].name === 'Ekubo';
    if (!condition1) {
      if (retry < MAX_RETRY) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return this._fetchQuotes(params, retry + 1);
      } else {
        throw new Error('No quotes found');
      }
    }

    this.logger.log(
      `Expected xSTRK to receive: ${Web3Number.fromWei(quotes[0].buyAmount.toString(), 18).toString()} xSTRK`,
    );

    const calldata = await fetchBuildExecuteTransaction(quotes[0].quoteId);
    const call: Call = calldata.calls[1];
    const callData: string[] = call.calldata as string[];
    const routesLen = Number(callData[11]);
    assert(routesLen > 0, 'No routes found');
    const routes: Route[] = [];

    let startIndex = 12;
    for (let i = 0; i < routesLen; ++i) {
      const swap_params_len = Number(callData[startIndex + 4]);
      const route: Route = {
        token_from: callData[startIndex],
        token_to: callData[startIndex + 1],
        exchange_address: callData[startIndex + 2],
        percent: Number(callData[startIndex + 3]),
        additional_swap_params:
          swap_params_len > 0
            ? callData.slice(startIndex + 5, startIndex + 5 + swap_params_len)
            : [],
      };
      routes.push(route);
      startIndex += 5 + swap_params_len;
    }

    const swapInfo: SwapInfo = {
      token_from_address: getAddresses(getNetwork()).Strk,
      token_from_amount: uint256.bnToUint256((params.sellAmount ?? 0).toString()),
      token_to_address: getAddresses(getNetwork()).LST,
      token_to_amount: uint256.bnToUint256('0'),
      token_to_min_amount: uint256.bnToUint256('1'), // bypass slippage check
      beneficiary: getAddresses(getNetwork()).ARB_CONTRACT,
      integrator_fee_amount_bps: 0,
      integrator_fee_recipient: getAddresses(getNetwork()).ARB_CONTRACT,
      routes,
    };
    return {
      swapInfo,
      amountOut: Web3Number.fromWei(quotes[0].buyAmount.toString(), 18),
    };
  }

  async executeArb(swapInfo: SwapInfo) {
    if (!this.arbContract) {
      throw new Error('Arb contract is not initialized');
    }
    const call = this.arbContract.populate('buy_xstrk', {
      swap_params: swapInfo,
      receiver: '0x06bF0f343605525d3AeA70b55160e42505b0Ac567B04FD9FC3d2d42fdCd2eE45', // treasury arb (VT holds)
    });
    const account = this.config.get('account');
    const provider = this.config.get('provider');
    const tx = await account.execute([call]);
    this.logger.log('Performing arb: tx', tx.transaction_hash);
    await provider.waitForTransaction(tx.transaction_hash, {
      successStates: [TransactionExecutionStatus.SUCCEEDED],
    });
    this.logger.log('Arb tx confirmed');
    const amount = Web3Number.fromWei(
      uint256.uint256ToBN(swapInfo.token_from_amount).toString(),
      18,
    );
    this.notifService.sendMessage(
      `Arb tx confirmed: ${tx.transaction_hash} with amount ${amount.toString()} STRK`,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  @TryCatchAsync(3, 100000)
  async claimRewards() {
    const unclaimedRewards = await this.lstService.unclaimedRewards();
    this.logger.log(`Total unclaimed rewards: ${unclaimedRewards.toString()} STRK`);
    if (unclaimedRewards.gt(0)) {
      await this.lstService.claimRewards();
      this.notifService.sendMessage(`Claimed rewards: ${unclaimedRewards.toString()} STRK`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  @TryCatchAsync(3, 100000)
  async claimUnstakedFunds() {
    try {
      const delegators = await this.delegatorService.getUnstakeAmounts();
      const now = new Date();
      this.logger.log(`Checking unstaked funds for ${delegators.length} delegators`);

      let totalUnstakeAmount = 0;
      const calls = delegators
        .map((del) => {
          if (del.unPoolTime && del.unPoolTime <= now) {
            this.logger.log(`Unstake time reached for ${del.delegator.address}`);
            this.notifService.sendMessage(`Unstake time reached for ${del.delegator.address}`);
            const call = del.delegator.populate('unstake_action', []);
            totalUnstakeAmount += Number(del.unPoolAmount.toString());
            return call;
          } else {
            this.logger.log(`Unstake time not reached for ${del.delegator.address}`);
            this.logger.log(`Unstake time: ${del.unPoolTime}, Current time: ${now}`);
          }
          return null;
        })
        .filter((call): call is Call => call !== null);

      if (calls.length == 0) {
        this.logger.log(`No unstake actions to perform`);
        this.notifService.sendMessage(`No unstake actions to perform`);
        return;
      }

      this.notifService.sendMessage(
        `Unstake actions: ${calls.length}, TotalAmount: ${totalUnstakeAmount.toFixed(0)} STRK`,
      );
      const account = this.config.get('account');
      const provider = this.config.get('provider');
      const tx = await account.execute(calls);
      this.logger.log('Unstake tx: ', tx.transaction_hash);
      await provider.waitForTransaction(tx.transaction_hash, {
        successStates: [TransactionExecutionStatus.SUCCEEDED],
      });
      this.logger.log('Unstake tx confirmed');
      this.notifService.sendMessage(`Unstake tx confirmed: ${tx.transaction_hash}`);
    } catch (err) {
      console.error('Error in claimUnstakedFunds:', err);
      throw err;
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  @TryCatchAsync(3, 10000)
  async updateEkuboPositionsTimeseries() {
    await populateEkuboTimeseries(true);
  }

  @Cron('0 12 * * 1') // Every Monday at 12:00 UTC (after Sunday ends in UTC-12, the latest timezone)
  @TryCatchAsync()
  async weeklyPointsSnapshot() {
    this.logger.log(
      'Running weekly points snapshot - Monday 12:00 UTC (after Sunday ends globally)',
    );

    try {
      // Calculate PREVIOUS week boundaries (the completed week we're taking snapshot of)
      const now = new Date();

      // Get the start of current week (last Sunday at 00:00)
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);

      // Previous week end is current week start minus 1 millisecond
      const previousWeekEnd = new Date(currentWeekStart.getTime() - 1);

      // Previous week start is 7 days before current week start
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(currentWeekStart.getDate() - 7);

      this.logger.log(
        `Taking snapshot for COMPLETED week: ${previousWeekStart.toISOString()} to ${previousWeekEnd.toISOString()}`,
      );

      // Get all users with points from points_aggregated table
      const currentPointsSnapshot = await prisma.points_aggregated.findMany({
        select: {
          user_address: true,
          total_points: true,
        },
      });

      this.logger.log(`Found ${currentPointsSnapshot.length} users with points for snapshot`);

      if (currentPointsSnapshot.length === 0) {
        this.logger.warn('No users found with points, skipping snapshot');
        return;
      }

      // Check if snapshot already exists for this week
      const existingSnapshot = await prisma.cumulative_weekly_snapshot_points.findFirst({
        where: {
          week_start_date: previousWeekStart,
        },
      });

      if (existingSnapshot) {
        this.logger.warn(
          `Snapshot already exists for week starting ${previousWeekStart.toISOString()}, skipping`,
        );
        return;
      }

      // Batch insert snapshots for all users
      const snapshotRecords = currentPointsSnapshot.map((userPoints) => ({
        user_address: userPoints.user_address,
        total_points: userPoints.total_points,
        week_start_date: previousWeekStart,
        week_end_date: previousWeekEnd,
        snapshot_taken_at: now,
      }));

      // Use createMany for better performance
      const result = await prisma.cumulative_weekly_snapshot_points.createMany({
        data: snapshotRecords,
        skipDuplicates: true,
      });

      this.logger.log(`Weekly points snapshot completed. Created ${result.count} snapshots`);

      // Send notification about the snapshot completion
      this.notifService.sendMessage(
        `📊 Weekly Points Snapshot Completed\n` +
          `Week: ${previousWeekStart.toDateString()} - ${previousWeekEnd.toDateString()}\n` +
          `✅ Snapshots created: ${result.count}\n` +
          `📅 Taken at: ${now.toISOString()}`,
      );
    } catch (error) {
      this.logger.error(
        'Error in weekly points snapshot:',
        error instanceof Error ? error.message : String(error),
      );

      // Send error notification
      this.notifService.sendMessage(
        `🚨 Weekly Points Snapshot Failed\n` +
          `Error: ${error instanceof Error ? error.message : String(error)}\n` +
          `Time: ${new Date().toISOString()}`,
      );
    }
  }
}
