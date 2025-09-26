// import assert from "assert";

import {
  AvnuOptions,
  BASE_URL,
  // fetchBuildExecuteTransaction,
  fetchQuotes,
  // fetchSources,
  // fetchTokens,
  // QuoteRequest,
  SEPOLIA_BASE_URL,
} from "@avnu/avnu-sdk";
import { CronMonitor } from '@hemantwasthere/monitoring-sdk'
import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AvnuWrapper, ContractAddr, getMainnetConfig, Global, PricerFromApi, Web3Number } from "@strkfarm/sdk";
import {
  Account,
  Call,
  Contract,
  RpcProvider,
  TransactionExecutionStatus,
  // Uint256,
  // uint256,
} from "starknet";

import RelayerMonitoring from "./relayer.monitoring";
import { getAddresses, getAllSupportedTokens, getLSTInfo, getTokenInfoFromAddr } from "../common/constants";
import { BotService } from "../common/services/bot.service";
import { getNetwork, Network, STRK_TOKEN, TryCatchAsync } from "../common/utils";
import { ConfigService } from "./services/configService";
import { DelegatorService, PoolMemberInfo } from "./services/delegatorService";
import { LSTService } from "./services/lstService";
import { NotifService } from "./services/notifService";
import { PendingWithdraws, PrismaService } from "./services/prismaService";
import { RPCWrapper } from "./services/RPCWrapper";
import { ValidatorRegistryService } from "./services/validatorRegistryService";
import { WithdrawalQueueService } from "./services/withdrawalQueueService";
import {ABI as SwapExtensionAbi} from "../../abis/SwapExtensionAbi";

/***
 * Sequence is important here
 * - Unstake funds and withdraw queue handling can be more frequent. 
 * They will automatically handle any available funds to process withdrawals
 * - 
 * 
 */
function getCronSettings(action: "process-withdraw-queue" | "stake-funds" | "unstake-intent") {
  const config = new ConfigService();
  switch (action) {
    case "process-withdraw-queue":
      return config.isSepolia()
        ? CronExpression.EVERY_5_MINUTES
        : CronExpression.EVERY_HOUR;
    case "stake-funds":
      return config.isSepolia()
        ? CronExpression.EVERY_10_MINUTES
        : "0 30 0 * * *"; // every day at 12:30 AM
    case "unstake-intent":
      return config.isSepolia()
        ? CronExpression.EVERY_10_MINUTES
        : "0 30 1 * * *"; // every day at 1:30 AM
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// interface Route {
//   token_from: string;
//   token_to: string;
//   exchange_address: string;
//   percent: number;
//   additional_swap_params: string[];
// }

// Deprecated local SwapInfo (kept in comments for reference)

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
  readonly validatorRegistryService: ValidatorRegistryService;
  readonly rpcWrapper: RPCWrapper;

  arbContract: Contract | null = null;
  readonly account: Account;
  readonly provider: RpcProvider;

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
    @Inject(forwardRef(() => ValidatorRegistryService))
    validatorRegistryService: ValidatorRegistryService,
    @Inject(forwardRef(() => RPCWrapper))
    rpcWrapper: RPCWrapper,
  ) {
    this.config = config;
    this.withdrawalQueueService = withdrawalQueueService;
    this.delegatorService = delegatorService;
    this.prismaService = prismaService;
    this.lstService = lstService;
    this.notifService = notifService;
    this.botService = botService;
    this.validatorRegistryService = validatorRegistryService;
    this.rpcWrapper = rpcWrapper;

    this.account = this.config.get("account");
    this.provider = this.config.get("provider");
  }

  // Run the same task on startup
  @TryCatchAsync()
  async onModuleInit() {
    console.log("Running task on application start...");

    // Wait for ValidatorRegistryService to be fully initialized
    await this.waitForValidatorRegistryService();

    // set up arb contract
    if (getNetwork() == Network.mainnet) {
      const provider = this.config.get("provider");
      const ARB_ADDR = getAddresses(getNetwork()).ARB_CONTRACT;
      const cls = await provider.getClassAt(ARB_ADDR.address);
      this.arbContract = new Contract({abi: cls.abi, address: ARB_ADDR.address, providerOrAccount: provider as any});
    }

    // Run on init
    await this.claimUnstakedFunds();
    await this.processWithdrawQueue();
    await this.sendStats();
    // await this.checkAndExecuteArbitrage();

    // Just for testing
    // await this.stakeFunds();
    // await this.updateEkuboPositionsTimeseries();
    // await this.claimRewards();
    // await this.swapRewardsToUnderlyingToken()
    // await this.handleUnstakeIntents();
  }

  private async waitForValidatorRegistryService() {
    console.log("Waiting for ValidatorRegistryService to initialize...");
    
    // Wait for validators to be loaded (indicates service is ready)
    let attempts = 0;
    const maxAttempts = 120; // 120 seconds timeout
    const checkInterval = 1000; // 1 second
    
    while (attempts < maxAttempts) {
      try {
        // Check if validators are loaded by trying to get validators for a token
        if (this.validatorRegistryService.isInitialized) {
          return;
        } else {
          this.logger.log("ValidatorRegistryService not initialized yet, waiting...");
        }
      } catch (error) {
        // Service not ready yet, continue waiting
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    throw new Error("ValidatorRegistryService failed to initialize within timeout period");
  }

  @CronMonitor.monitor("process-withdraw-queue")
  @Cron(getCronSettings("process-withdraw-queue"))
  @TryCatchAsync()
  async processWithdrawQueue() {
    const supportedTokens = getAllSupportedTokens();
    for (const token of supportedTokens) {
      await this._processWithdrawQueue(token);
    }
  }

  async processWithdrawal(
    w: PendingWithdraws, 
    assetAddress: ContractAddr, 
    balanceLeft: Web3Number, 
    allowedCummulativeLimit: Web3Number,
    processedWithdrawalsInLast24HoursDecimalAdjusted: number,
  ) {
    const lstInfo = getLSTInfo(assetAddress);
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    const MAX_WITHDRAWALS_PER_DAY = lstInfo.maxWithdrawalsPerDay;
    const amount = Web3Number.fromWei(w.amount, tokenInfo.decimals);
    const requestCum = Web3Number.fromWei(
      w.cumulative_requested_amount_snapshot,
      tokenInfo.decimals
    );

    this.logger.log(`Processing withdrawal ID#${w.request_id} with amount ${amount.toString()}, balanceLeft: ${balanceLeft.toString()}, allowedCummulativeLimit: ${allowedCummulativeLimit.toString()}, requestCum: ${requestCum.toString()}`);
    // Ensure if we have enough balance and allowed cumulative limit
    if (
      amount.gt(balanceLeft) ||
      requestCum.gt(allowedCummulativeLimit)
    ) {
      this.logger.warn(
        `Skipping withdrawal ID#${w.request_id} due to insufficient balance or not ready`
      );
      this.logger.warn(
        `request amount: ${amount.toString()}, req time: ${new Date(w.timestamp * 1000).toLocaleString()}`
      );
      return {
        call: null,
        balanceLeft: balanceLeft,
        processedWithdrawalsInLast24HoursDecimalAdjusted: processedWithdrawalsInLast24HoursDecimalAdjusted,
      }
    }

    // limit max automated withdrawals per day
    processedWithdrawalsInLast24HoursDecimalAdjusted += amount.toNumber();
    if (
      processedWithdrawalsInLast24HoursDecimalAdjusted >
      MAX_WITHDRAWALS_PER_DAY
    ) {
      this.notifService.sendMessage(
        `${tokenInfo.symbol} Processed withdrawals in last 24 hours exceeded limit: ${processedWithdrawalsInLast24HoursDecimalAdjusted.toString()}`
      );
      return {
        call: null,
        balanceLeft: balanceLeft,
        processedWithdrawalsInLast24HoursDecimalAdjusted: processedWithdrawalsInLast24HoursDecimalAdjusted,
      }
    }

    this.logger.debug(
      `${tokenInfo.symbol} Claiming withdrawal ID#${w.request_id} with amount ${amount.toString()}`
    );
      
    // todo
    // await this.botService.sendUnstakeCompletionEvent(
    //   w.receiver.toString(),
    //   amount_strk.toString(), // amount
    //   "STRK", // token name
    //   {
    //     requestId: w.request_id.toString(),
    //     timestamp: w.timestamp,
    //     withdrawalQueueAddress: getAddresses(getNetwork()).WithdrawQueue,
    //   }
    // );

    // create call object
    const call = this.withdrawalQueueService.getClaimWithdrawalCall(
      assetAddress,
      w.request_id
    );
    balanceLeft = balanceLeft.minus(amount.toString());

    return {
      call,
      balanceLeft,
      processedWithdrawalsInLast24HoursDecimalAdjusted,
    }
  }

  async _processWithdrawQueue(assetAddress: ContractAddr) {
    this.logger.log(`Running processWithdrawQueue task for ${assetAddress.address}`);

    const lstInfo = getLSTInfo(assetAddress);
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);

    // todo do not process withdrawals less than 30min old
    // to avoid making any inflation attack profitable

    await this.withdrawToWQ(assetAddress);
    // note update this to 0.1 STRK or other min amounts for other tokens
    const min_amount = lstInfo.minWithdrawalAutoProcessAmount;

    // get pending withdrawals
    const [pendingWithdrawals, rejected_ids] =
      await this.prismaService.getPendingWithdraws(assetAddress, min_amount);
    this.logger.debug(`${tokenInfo.symbol} Found ${pendingWithdrawals.length} pending withdrawals`);

    // metrics: total pending requests, amount, max pending time
    const totalPendingAmount = pendingWithdrawals.reduce((acc, w) => acc.plus(Web3Number.fromWei(w.amount, tokenInfo.decimals)), new Web3Number("0", tokenInfo.decimals));
    const oldestTs = pendingWithdrawals.length > 0 ? Math.min(...pendingWithdrawals.map(w => Number(w.timestamp))) : undefined;

    RelayerMonitoring.recordPendingRequests(tokenInfo.symbol, pendingWithdrawals.length, Number(totalPendingAmount.toString()), oldestTs);

    let balanceLeft = await this.withdrawalQueueService.getAssetBalance(assetAddress);
    this.logger.log(`${tokenInfo.symbol} Balance left: ${balanceLeft.toString()}`);

    const allowedLimit = await this.getAllowedCummulativeLimit(assetAddress);

    const MAX_WITHDRAWALS_PER_DAY = lstInfo.maxWithdrawalsPerDay;
    const processedWithdrawalsInLast24Hours =
      await this.prismaService.getWithdrawalsLastDay(assetAddress);
    let processedWithdrawalsInLast24HoursDecimalAdjusted = Number(
      processedWithdrawalsInLast24Hours / BigInt(10 ** tokenInfo.decimals)
    );
    this.logger.log(
      `${tokenInfo.symbol} Processed withdrawals in last 24 hours: ${processedWithdrawalsInLast24HoursDecimalAdjusted.toString()}`
    );

    console.table([{
      token: tokenInfo.symbol,
      processedWithdrawalsInLast24HoursDecimalAdjusted: processedWithdrawalsInLast24HoursDecimalAdjusted.toString(),
      allowedCummulativeLimit: allowedLimit.toString(),
      balanceLeftInWQ: balanceLeft.toString(),
      pendingWithdrawals: pendingWithdrawals.length,
      pendingAmount: pendingWithdrawals.reduce((acc, w) => acc.plus(Web3Number.fromWei(w.amount, tokenInfo.decimals)), new Web3Number("0", tokenInfo.decimals)).toString(),
      rejected_ids: rejected_ids.length,
      MAX_WITHDRAWALS_PER_DAY: MAX_WITHDRAWALS_PER_DAY,
      processedWithdrawalsInLast24Hours: processedWithdrawalsInLast24Hours.toString(),
    }])

    // claim withdrawals
    // send 10 at a time
    const MAX_WITHDRAWALS = 10;
    for (let i = 0; i < pendingWithdrawals.length; i += MAX_WITHDRAWALS) {
      const batch = pendingWithdrawals.slice(i, i + MAX_WITHDRAWALS);
      this.logger.log(
        `Claiming ${batch.length} withdrawals from ${i} to ${i + MAX_WITHDRAWALS - 1}`
      );

      // loop and generate SN Call objects
      const calls: Call[] = [];
      for (const w of batch) {
        // generate call object and update balance and processed amount
        const { call, balanceLeft: _balanceLeft, processedWithdrawalsInLast24HoursDecimalAdjusted: _processedAmount } = await this.processWithdrawal(
          w, 
          assetAddress, 
          balanceLeft, 
          allowedLimit, 
          processedWithdrawalsInLast24HoursDecimalAdjusted
        );
        if (call) {
          calls.push(call);
          balanceLeft = _balanceLeft;
          processedWithdrawalsInLast24HoursDecimalAdjusted = _processedAmount;
        }
      }

      // if no withdrawals to claim, continue
      if (
        calls.length === 0
      ) {
        this.logger.warn(`${tokenInfo.symbol} No withdrawals to claim`);
        continue;
      }

      // send transactions to claim withdrawals
      // note: nonce is set to 'pending' to get the next nonce
      const res = await this.account.execute(calls);
      this.notifService.sendMessage(
        `${tokenInfo.symbol} Claimed ${res.transaction_hash} withdrawals`
      );
      await this.provider.waitForTransaction(res.transaction_hash);
      this.notifService.sendMessage(
        `${tokenInfo.symbol} Transaction ${res.transaction_hash} confirmed`
      );

      // if less than MAX_WITHDRAWALS, break entire loop as there are no more withdrawals to claim
      if (
        calls.length < MAX_WITHDRAWALS &&
        i + MAX_WITHDRAWALS >= pendingWithdrawals.length
      ) {
        this.logger.warn(`${tokenInfo.symbol} No more withdrawals to claim`);
        break;
      }
    }

    this.logger.log(`${tokenInfo.symbol} Rejected ${rejected_ids.length} withdrawals`);
    this.logger.log(`${tokenInfo.symbol} Completed processWithdrawQueue task`);
  }

  async getAllowedCummulativeLimit(assetAddress: ContractAddr) {
    const withdrawQueueState =
    await this.withdrawalQueueService.getWithdrawalQueueState(assetAddress);
    this.logger.log(
      "cummulative amount: ",
      withdrawQueueState.cumulative_requested_amount.toString()
    );
    this.logger.log(
      "unprocessed amount: ",
      withdrawQueueState.unprocessed_withdraw_queue_amount.toString()
    );
    const allowedLimit = withdrawQueueState.cumulative_requested_amount.minus(
      withdrawQueueState.unprocessed_withdraw_queue_amount.toString()
    );
    this.logger.log(`Allowed limit: ${allowedLimit.toString()}`);
    return allowedLimit;
  }

  /**
   * @description A separate cron job to emit unstake initiation event to bot, which will only consider last 5 minutes pending withdrawals
   */
  // todo
  // @Cron(CronExpression.EVERY_MINUTE)
  // @TryCatchAsync()
  // async emitUnstakeInitiationEvent() {
  //   const [pending_withdrawals] = await this.prismaService.getPendingWithdraws(
  //     new Web3Number("0.0", 18)
  //   );
  //   const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
  //   const recentWithdrawals = pending_withdrawals.filter(
  //     (w) => w.timestamp * 1000 > twoMinutesAgo && !w.is_notified
  //   );

  //   this.logger.log(
  //     `Found ${recentWithdrawals.length} recent unnotified withdrawals`
  //   );

  //   for (const w of recentWithdrawals) {
  //     try {
  //       await this.botService.sendUnstakeInitiationEvent(
  //         w.receiver.toString(),
  //         Web3Number.fromWei(w.amount_strk, 18).toString(), // amount
  //         "STRK", // token name
  //         {
  //           // metadata
  //           requestId: w.request_id.toString(),
  //           timestamp: w.timestamp,
  //           withdrawalQueueAddress: getAddresses(getNetwork()).WithdrawQueue,
  //         }
  //       );

  //       // Mark as notified after successful notification
  //       await this.prismaService.markWithdrawalAsNotified(w.request_id);
  //       this.logger.log(`Marked withdrawal ${w.request_id} as notified`);
  //     } catch (error) {
  //       this.logger.error(
  //         `Failed to send unstake initiation event for request ${w.request_id}:`,
  //         error
  //       );
  //       // Don't mark as notified if sending failed, so we can retry
  //     }
  //   }
  // }


  @CronMonitor.monitor("send-stats")
  @Cron(CronExpression.EVERY_6_HOURS)
  @TryCatchAsync()
  async sendStats() {
    const supportedTokens = getAllSupportedTokens();
    for (const token of supportedTokens) {
      await this._sendStats(token);
    }
  }

  async _sendStats(assetAddress: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    const [pending_withdrawals, rejected_ids] =
      await this.prismaService.getPendingWithdraws(assetAddress, new Web3Number("0.0", 18));
    const balanceLeft = await this.withdrawalQueueService.getAssetBalance(assetAddress);
    const stats = await this.withdrawalQueueService.getWithdrawalQueueState(assetAddress);
    this.notifService.sendMessage(
      `${tokenInfo.symbol} Pending Withdrawals: ${pending_withdrawals.length}, min ID: ${pending_withdrawals[0]?.request_id || "N/A"}`
    );
    this.notifService.sendMessage(
      `${tokenInfo.symbol} Rejected ${rejected_ids.length} withdrawals`
    );
    this.notifService.sendMessage(`${tokenInfo.symbol} Balance left: ${balanceLeft.toString()}`);
    this.notifService.sendMessage(`${tokenInfo.symbol} Withdrawal Queue State: \n
      Max Request ID: ${stats.max_request_id}\n
      Unprocessed Withdraw Queue Amount: ${stats.unprocessed_withdraw_queue_amount.toString()} ${tokenInfo.symbol}\n
      Intransit Amount: ${stats.intransit_amount.toString()} ${tokenInfo.symbol}\n
    `);
  }

  async withdrawToWQ(assetAddress: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    try {
      const wqState =
        await this.withdrawalQueueService.getWithdrawalQueueState(assetAddress);

      const balanceAmount = await this.validatorRegistryService.getUnassignedAmount(assetAddress);
      this.logger.log(`${tokenInfo.symbol} Balance amount: ${balanceAmount.toString()}`);
      const requiredAmount = wqState.unprocessed_withdraw_queue_amount;
      this.logger.log(`${tokenInfo.symbol} WQ Required amount: ${requiredAmount.toString()}`);

      // send to WQ if there is balance and required amount
      if (balanceAmount.gt(0) && requiredAmount.gt(0)) {
        const transferAmount = balanceAmount.lt(requiredAmount)
          ? balanceAmount
          : requiredAmount;
        this.logger.log(`${tokenInfo.symbol} transferAmount: ${transferAmount.toString()}`);
        await this.lstService.sendToWithdrawQueue(assetAddress, transferAmount);
      } else {
        if (balanceAmount.lte(0)) {
          this.logger.log(`${tokenInfo.symbol} No balance to send to WQ`);
        } else if (requiredAmount.lte(0)) {
          this.logger.log(`${tokenInfo.symbol} No required amount in WQ`);
        }
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string" &&
        (error as any).message.includes("Caller is missing role")
      ) {
        this.logger.warn(
          `${tokenInfo.symbol} Account does not have permission to send funds to withdraw queue. Skipping this operation.`
        );
        this.notifService.sendMessage(
          `${tokenInfo.symbol} Account missing role permissions for withdraw queue transfer`
        );
      } else {
        this.logger.error(`${tokenInfo.symbol} Error in withdrawToWQ:`, error);
        throw error; // Re-throw other errors
      }
    }
  }

  @CronMonitor.monitor("stake-funds")
  @Cron(getCronSettings("stake-funds"))
  @TryCatchAsync()
  async stakeFunds() {
    this.logger.log("Staking funds");
    const supportedTokens = getAllSupportedTokens();
    // handled un-assigned stakes
    this.logger.log("Handling un-assigned stakes");
    for (const token of supportedTokens) {
    const unassignedAmount = await this.validatorRegistryService.getUnassignedAmount(token);
      const lstInfo = getLSTInfo(token);
      if (unassignedAmount.gt(lstInfo.minWithdrawalAutoProcessAmount.multipliedBy(100))) { // min 100x of minWithdrawalAutoProcessAmount
        const randomValidator = this.validatorRegistryService.chooseRandomValidator(token);
        await this._stakeFunds(token, randomValidator.address,  unassignedAmount, false);
      } else {
        this.logger.log(`No unassigned amount for token ${token.address}`);
      }
    }

    // handled assigned stakes
    this.logger.log("Handling assigned stakes");
    for (const token of supportedTokens) {
      const validators = this.validatorRegistryService.getValidatorsForToken(token);
      const lstInfo = getLSTInfo(token);
      const tokenInfo = await getTokenInfoFromAddr(token);
      for (const validator of validators) {
        const validatorTokenInfo = await this.validatorRegistryService.getValidatorTokenInfo(validator.address, token);
        if (validatorTokenInfo.pendingStakeAmount.gt(lstInfo.minWithdrawalAutoProcessAmount.multipliedBy(100))) { // min 100x of minWithdrawalAutoProcessAmount
          await this._stakeFunds(token, validator.address, validatorTokenInfo.pendingStakeAmount, true);
        } else {
          this.logger.log(`${tokenInfo.symbol} No pending stake amount for validator ${validator.address.address} ${token.address}`);
        }
      }
    }
  }

  async _stakeFunds(tokenAddress: ContractAddr, validatorAddress: ContractAddr, amount: Web3Number, isAssignedStake: boolean) {
    const tokenInfo = await getTokenInfoFromAddr(tokenAddress);
    const lstInfo = getLSTInfo(tokenAddress);

    const stakeAmount = amount.gt(lstInfo.maxStakePerTx) ? new Web3Number(lstInfo.maxStakePerTx, tokenInfo.decimals) : amount;
    this.logger.log(`Staking ${stakeAmount.toString()}, totalAmount: ${amount.toString()} ${tokenInfo.symbol} to validator ${validatorAddress.address}, isAssignedStake: ${isAssignedStake}`);
    await this.delegatorService.stakeToValidator(validatorAddress, tokenAddress, stakeAmount, isAssignedStake);
    RelayerMonitoring.recordStakeAction(tokenInfo.symbol, validatorAddress.address, isAssignedStake, Number(stakeAmount.toString()));

    const remainingAmount = amount.minus(stakeAmount);
    if (remainingAmount.gt(0)) {
      await this._stakeFunds(tokenAddress, validatorAddress, remainingAmount, true);
    }
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // @TryCatchAsync()
  // async checkAndExecuteArbitrage() {
  //   if (getNetwork() != Network.mainnet) return;

    // todo modify arb contract to take flash loan from vesu and
    // execute swap using avnu swap (so that more routes can be used)
  //   const strkBalanceLST = await this.lstService.getSTRKBalance();
  //   const account: Account = this.config.get("account");
  //   const queueStats =
  //     await this.withdrawalQueueService.getWithdrawalQueueState();
  //   const pendingAmount = queueStats.unprocessed_withdraw_queue_amount;
  //   this.logger.log(`Pending amount: ${pendingAmount.toString()} STRK`);

  //   const availableAmount = strkBalanceLST.minus(pendingAmount.toString());
  //   this.logger.log(`Available amount: ${availableAmount.toString()} STRK`);
  //   const exchangeRate = await this.lstService.exchangeRate();
  //   this.logger.log(`Exchange rate: ${exchangeRate}`);

  //   const ADDRESSES = getAddresses(getNetwork());
  //   const availableAmountNum = Number(availableAmount.toString()) * 0.95; // max use 95% of amount

  //   for (let i = 0; i < 9; i++) {
  //     if (availableAmountNum > 1000) {
  //       const amount = Math.floor((availableAmountNum * (10 - i - 1)) / 10);
  //       this.logger.log(`Checking arb for ${amount.toString()} STRK`);
  //       const amount_str = new Web3Number(amount, 18).toWei();
  //       const params: QuoteRequest = {
  //         sellTokenAddress: ADDRESSES.Strk,
  //         buyTokenAddress: ADDRESSES.LST,
  //         sellAmount: BigInt(amount_str),
  //         takerAddress: ADDRESSES.ARB_CONTRACT,
  //         // excludeSources: ['Nostra', 'Haiko(Solvers)'], // cause only Ekubo is configured for now in the arb contract
  //       };
  //       const swapInfo = await this._fetchQuotes(params);
  //       const amountOut = swapInfo.amountOut;
  //       const equivalentAmount = Number(amountOut.toString()) * exchangeRate;
  //       this.logger.log(`Equivalent amount (STRK): ${equivalentAmount}`);
  //       const potentialProfit = equivalentAmount - amount;
  //       this.logger.log(`Potential profit: ${potentialProfit}`);

  //       const shouldExecuteCond1 =
  //         equivalentAmount > amount && potentialProfit > 5; // min profit 5 STRK
  //       const shouldExecuteCond2 = potentialProfit / amount > 0.002; // min profit % of 0.2%, avoid order matching large amounts for small arbitrage
  //       if (shouldExecuteCond1 && shouldExecuteCond2) {
  //         // min profit 5 STRK
  //         this.logger.log(`Executing swap for ${amount.toString()} STRK`);
  //         await this.executeArb(swapInfo.swapInfo);
  //         this.notifService.sendMessage(
  //           `Potential profit: ${potentialProfit.toFixed(2)} STRK`
  //         );
  //         return;
  //       } else if (shouldExecuteCond1) {
  //         this.logger.log(
  //           `Potential profit % is less than 0.2%: ${(potentialProfit / amount).toFixed(4)}, more info: ${potentialProfit.toFixed(2)} / ${amount.toFixed(2)}}`
  //         );
  //       }
  //       //  else {
  //       //   this.logger.log(`Potential profit is less than 5 STRK: ${potentialProfit.toFixed(2)} / ${amount.toFixed(2)}}`);
  //       // }
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //     }
  //   }
  // }

  // async _fetchQuotes(
  //   params: QuoteRequest,
  //   retry = 0
  // ): Promise<{
  //   swapInfo: SwapInfo;
  //   amountOut: Web3Number;
  // }> {
  //   const MAX_RETRY = 10;
  //   const quotes = await fetchQuotes(params);

  //   const condition1 = quotes.length > 0;
  //   // only ekubo, and it should be one route only
  //   // const condition2 = condition1 && quotes[0].routes.length == 1 && quotes[0].routes[0].name === 'Ekubo';
  //   if (!condition1) {
  //     if (retry < MAX_RETRY) {
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //       return this._fetchQuotes(params, retry + 1);
  //     } else {
  //       throw new Error("No quotes found");
  //     }
  //   }

  //   this.logger.log(
  //     `Expected xSTRK to receive: ${Web3Number.fromWei(quotes[0].buyAmount.toString(), 18).toString()} xSTRK`
  //   );

  //   const calldata = await fetchBuildExecuteTransaction(quotes[0].quoteId);
  //   const call: Call = calldata.calls[1];
  //   const callData: string[] = call.calldata as string[];
  //   const routesLen = Number(callData[11]);
  //   assert(routesLen > 0, "No routes found");
  //   const routes: Route[] = [];

  //   let startIndex = 12;
  //   for (let i = 0; i < routesLen; ++i) {
  //     const swap_params_len = Number(callData[startIndex + 4]);
  //     const route: Route = {
  //       token_from: callData[startIndex],
  //       token_to: callData[startIndex + 1],
  //       exchange_address: callData[startIndex + 2],
  //       percent: Number(callData[startIndex + 3]),
  //       additional_swap_params:
  //         swap_params_len > 0
  //           ? callData.slice(startIndex + 5, startIndex + 5 + swap_params_len)
  //           : [],
  //     };
  //     routes.push(route);
  //     startIndex += 5 + swap_params_len;
  //   }

  //   const swapInfo: SwapInfo = {
  //     token_from_address: getAddresses(getNetwork()).Strk,
  //     token_from_amount: uint256.bnToUint256(
  //       (params.sellAmount ?? 0).toString()
  //     ),
  //     token_to_address: getAddresses(getNetwork()).LST,
  //     token_to_amount: uint256.bnToUint256("0"),
  //     token_to_min_amount: uint256.bnToUint256("1"), // bypass slippage check
  //     beneficiary: getAddresses(getNetwork()).ARB_CONTRACT.address,
  //     integrator_fee_amount_bps: 0,
  //     integrator_fee_recipient: getAddresses(getNetwork()).ARB_CONTRACT,
  //     routes,
  //   };
  //   return {
  //     swapInfo,
  //     amountOut: Web3Number.fromWei(quotes[0].buyAmount.toString(), 18),
  //   };
  // }

  // async executeArb(swapInfo: SwapInfo) {
  //   if (!this.arbContract) {
  //     throw new Error("Arb contract is not initialized");
  //   }
  //   const call = this.arbContract.populate("buy_xstrk", {
  //     swap_params: swapInfo,
  //     receiver:
  //       "0x06bF0f343605525d3AeA70b55160e42505b0Ac567B04FD9FC3d2d42fdCd2eE45", // treasury arb (VT holds)
  //   });
  //   const account = this.config.get("account");
  //   const provider = this.config.get("provider");
  //   const tx = await account.execute([call]);
  //   this.logger.log("Performing arb: tx", tx.transaction_hash);
  //   await provider.waitForTransaction(tx.transaction_hash, {
  //     successStates: [TransactionExecutionStatus.SUCCEEDED],
  //   });
  //   this.logger.log("Arb tx confirmed");
  //   const amount = Web3Number.fromWei(
  //     uint256.uint256ToBN(swapInfo.token_from_amount).toString(),
  //     18
  //   );
  //   this.notifService.sendMessage(
  //     `Arb tx confirmed: ${tx.transaction_hash} with amount ${amount.toString()} STRK`
  //   );
  // }

  @CronMonitor.monitor("claim-rewards")
  @Cron(CronExpression.EVERY_5_MINUTES)
  @TryCatchAsync(3, 100000)
  async claimRewards() {
    const supportedTokens = getAllSupportedTokens();
    for (const token of supportedTokens) {
      await this._claimRewards(token);
    }
  }

  async _claimRewards(assetAddress: ContractAddr) {
    const unclaimedRewards = await this.delegatorService.getTotalUnclaimedRewards(assetAddress);
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    for (const reward of unclaimedRewards) {
      this.logger.log(
        `Claiming rewards: ${reward.amount.toString()} ${tokenInfo.symbol} for validator ${reward.validatorAddress}`
      );
      if (reward.amount == 0) {
        continue;
      } 
      await this.validatorRegistryService.claimRewards(reward.validatorAddress, assetAddress);
      RelayerMonitoring.recordRewardsClaimed(tokenInfo.symbol, reward.validatorAddress.address);
      this.notifService.sendMessage(
        `Claimed rewards: ${reward.amount.toString()} ${tokenInfo.symbol} for validator ${reward.validatorAddress}`
      );
    }
  }

  @CronMonitor.monitor("claim-unstaked-funds")
  @Cron(getCronSettings("process-withdraw-queue"))
  @TryCatchAsync(3, 100000)
  async claimUnstakedFunds() {
    const supportedTokens = getAllSupportedTokens();
    for (const token of supportedTokens) {
      await this._claimUnstakedFunds(token);
    }
  }
  
  async _claimUnstakedFunds(assetAddress: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    try {
      const delegators = await this.delegatorService.getUnstakeAmounts(assetAddress);
      const now = new Date();
      this.logger.log(
        `${tokenInfo.symbol} Checking unstaked funds for ${delegators.length} delegators`
      );

      // generate calls to unstake
      let totalUnstakeAmount = 0;
      const logInfo: any[] = [];
      const calls: Call[] = delegators
        .map((del) => {
          if (del.unPoolTime && del.unPoolTime <= now) {
            this.logAndSendMessage(
              `${tokenInfo.symbol} Unstake time reached for ${del.delegator.address}`,
              'log'
            );
            logInfo.push({
              delegator: del.delegator.address,
              unPoolAmount: del.unPoolAmount.toString(),
              unPoolTime: del.unPoolTime,
              unPoolTimeReached: true,
            });
            const call = del.delegator.populate("unstake_action", [assetAddress.address]);
            totalUnstakeAmount += Number(del.unPoolAmount.toString());
            return call;
          } else if (!del.unPoolTime) {
            // nothing to do
          } else {
            this.logAndSendMessage(
              `${tokenInfo.symbol} Unstake time not reached for ${del.delegator.address}`,
              'log'
            );
            logInfo.push({
              delegator: del.delegator.address,
              unPoolAmount: del.unPoolAmount.toString(),
              unPoolTime: del.unPoolTime,
              unPoolTimeReached: false,
            });
          }
          return null;
        })
        .filter((call) => call !== null) as Call[];

      console.table(logInfo);
      if (calls.length == 0) {
        this.logAndSendMessage(`No unstake actions to perform`, 'log');
        return;
      }

      this.logAndSendMessage(
        `${tokenInfo.symbol} Unstake actions: ${calls.length}, TotalAmount: ${totalUnstakeAmount.toFixed(0)} ${tokenInfo.symbol}`,
        'log'
      );

      const tx = await this.rpcWrapper.executeTransactions(calls, `Unstake action ${tokenInfo.symbol}`);
      this.logAndSendMessage(`${tokenInfo.symbol} Unstake tx confirmed: ${tx.transaction_hash}`, 'log');
    } catch (err) {
      console.error("Error in claimUnstakedFunds:", err);
      throw err;
    }
  }

  logAndSendMessage(message: string, logType: "log" | "warn" | "error" | "verbose" | "debug") {
    this.logger[logType](message);
    this.notifService.sendMessage(message);
  }

  @CronMonitor.monitor("update-ekubo-positions-timeseries")
  @Cron(CronExpression.EVERY_5_MINUTES)
  @TryCatchAsync(3, 10000)
  async updateEkuboPositionsTimeseries() {
    if (getNetwork() != Network.mainnet) return;
    // await populateEkuboTimeseries(true);
  }

  @CronMonitor.monitor("swap-rewards-to-underlying-token")
  @Cron(CronExpression.EVERY_5_MINUTES)
  @TryCatchAsync(3, 10000)
  async swapRewardsToUnderlyingToken() {
    const supportedTokens = getAllSupportedTokens();
    for (const token of supportedTokens) {
      // nothing to swap for STRK token
      if (token.eqString(STRK_TOKEN)) continue;
      
      // swap rewards to underlying token
      await this._swapRewardsToUnderlyingToken(token);

      // send received BTC to VR
      await this._sendBTCFromSwapExtensionToVR(token);
    }

  }

  async _swapRewardsToUnderlyingToken(assetAddress: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    const lstInfo = getLSTInfo(assetAddress);
    const swapExtension = lstInfo.swapExtension;
    const strkBalance = await this.lstService.getAssetBalance(ContractAddr.from(STRK_TOKEN), swapExtension.address);
    const isMainnet = getNetwork() == Network.mainnet;
    const avnuOptions: AvnuOptions = {
      baseUrl: isMainnet ? BASE_URL : SEPOLIA_BASE_URL,
    }

    if (strkBalance.lt(10)) {
      this.logger.log(`STRK => ${tokenInfo.symbol} Strk balance (${strkBalance.toString()}) is less than 10, skipping swap`);
      RelayerMonitoring.recordRewardSwap(tokenInfo.symbol, Number(strkBalance.toString()), "skipped");
      return;
    }
    
    // get quotes
    this.logger.log(`STRK => ${tokenInfo.symbol} Swapping ${strkBalance.toString()} STRK to ${assetAddress.address}`);
    const quotes = await fetchQuotes({
      sellTokenAddress: STRK_TOKEN,
      buyTokenAddress: assetAddress.address,
      sellAmount: BigInt(strkBalance.toWei()),
      takerAddress: swapExtension.address,
    }, avnuOptions);

    if (quotes.length == 0) {
      if (isMainnet) {
        this.notifService.sendMessage(`Swap Extension: No quotes found for STRK to ${tokenInfo.symbol}`);
      }
      return;
    }

    const avnuWrapper = new AvnuWrapper();
    const pricer = new PricerFromApi(getMainnetConfig(process.env.RPC_URL!), Global.getDefaultTokens());
    const strkPrice = await pricer.getPrice("STRK");
    const btcPrice = await pricer.getPrice("WBTC");
    const minAmount = new Web3Number((Number(strkBalance.toFixed(12)) * strkPrice.price / btcPrice.price).toFixed(12), tokenInfo.decimals).toWei();
    this.logger.log(`STRK => ${tokenInfo.symbol} Min amount: ${minAmount.toString()}`);
    const swapInfo = await avnuWrapper.getSwapInfo(quotes[0], swapExtension.address, 0, swapExtension.address, isMainnet ? minAmount.toString() : "1", avnuOptions);
  
    const swapContract = new Contract({abi: SwapExtensionAbi, address: swapExtension.address, providerOrAccount: this.provider});
    const call = swapContract.populate("swap", {
      swap_params: swapInfo,
    });
    const tx = await this.rpcWrapper.executeTransactions([call], `Swap STRK to ${tokenInfo.symbol}`);
    this.logger.log(`STRK => ${tokenInfo.symbol} Swap tx confirmed: ${tx.transaction_hash}`);
    await this.provider.waitForTransaction(tx.transaction_hash, {
      successStates: [TransactionExecutionStatus.SUCCEEDED],
    });
    this.logger.log(`STRK => ${tokenInfo.symbol} Swap tx confirmed`);
    RelayerMonitoring.recordRewardSwap(tokenInfo.symbol, Number(strkBalance.toString()), "swapped");
  }

  async _sendBTCFromSwapExtensionToVR(assetAddress: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    const lstInfo = getLSTInfo(assetAddress);
    const swapExtension = lstInfo.swapExtension;
    const btcBalance = await this.lstService.getAssetBalance(assetAddress, swapExtension.address);
 
    if (btcBalance.lt(0.000001)) {
      this.logger.log(`STRK => ${tokenInfo.symbol} BTC balance (${btcBalance.toString()}) is less than 0.000001, skipping pull`);
      return;
    }
    
    const swapContract = new Contract({abi: SwapExtensionAbi, address: swapExtension.address, providerOrAccount: this.provider});
    const call = swapContract.populate("pull", {
      amount: btcBalance.toWei(),
    })
    const tx = await this.rpcWrapper.executeTransactions([call], `Pull BTC from Swap Extension to VR`);
    this.logger.log(`STRK => ${tokenInfo.symbol} Pull BTC from Swap Extension to VR tx confirmed: ${tx.transaction_hash}`);
    await this.provider.waitForTransaction(tx.transaction_hash, {
      successStates: [TransactionExecutionStatus.SUCCEEDED],
    });
    this.logger.log(`STRK => ${tokenInfo.symbol} Pull BTC from Swap Extension to VR tx confirmed`);
  }

  @CronMonitor.monitor("unstake-intent")
  @Cron(getCronSettings('unstake-intent'))
  @TryCatchAsync(3, 10000)
  async handleUnstakeIntents() {
    const supportedTokens = getAllSupportedTokens();
    for (const token of supportedTokens) {
      try {
        await this._handleUnstakeIntents(token);
      } catch (err) {
        this.logger.error(`handleUnstakeIntents::${token.address} Error handling unstake intents: ${err}`, err);
        this.notifService.sendMessage(`handleUnstakeIntents::${token.address} Error handling unstake intents: ${err}`);
      }
    }
  }

  async _handleUnstakeIntents(assetAddress: ContractAddr) {
    // Eligible unstake amount
    // Unprocessed amount before 12hrs
    // i.e. pending unstake amounts - intransit amount - unstaked in 12hrs
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    const lstInfo = getLSTInfo(assetAddress);
    const [pendingUnstakeAmounts, _] = await this.prismaService.getPendingWithdraws(assetAddress, lstInfo.minWithdrawalAutoProcessAmount);
    console.table(pendingUnstakeAmounts);
    const totalPendingUnstakeAmount = pendingUnstakeAmounts.reduce((acc, curr) => acc.plus(Web3Number.fromWei(curr.amount, tokenInfo.decimals)), new Web3Number(0, tokenInfo.decimals));
    const totalUnstakedIn12hrs = pendingUnstakeAmounts
      .filter((withdraw) => withdraw.timestamp >= (Date.now() - 12 * 60 * 60 * 1000) / 1000)
      .reduce((acc, curr) => acc.plus(Web3Number.fromWei(curr.amount, tokenInfo.decimals)), new Web3Number(0, tokenInfo.decimals));
    this.logger.log(`handleUnstakeIntents::${tokenInfo.symbol} Total pending unstake amount: ${totalPendingUnstakeAmount.toFixed(12)}, Total unstaked in 12hrs: ${totalUnstakedIn12hrs.toFixed(12)}`);
    const withdrawQueueState = await this.withdrawalQueueService.getWithdrawalQueueState(assetAddress);
    const intransitAmount = withdrawQueueState.intransit_amount;
    const unprocessedWithdrawQueueAmount = withdrawQueueState.unprocessed_withdraw_queue_amount;
    this.logger.log(`handleUnstakeIntents::${tokenInfo.symbol} In transit amount: ${intransitAmount.toFixed(12)}, Unprocessed withdraw queue amount: ${unprocessedWithdrawQueueAmount.toFixed(12)}`);
    const eligibleUnstakeAmount = (totalPendingUnstakeAmount.minus(intransitAmount).minus(totalUnstakedIn12hrs)).minimum(unprocessedWithdrawQueueAmount);
    this.logger.log(`handleUnstakeIntents::${tokenInfo.symbol} Eligible unstake amount: ${eligibleUnstakeAmount.toString()}`);

    // if too small, skip
    const minUnstakeAmount = getLSTInfo(assetAddress).minUnstakeAmount;
    this.logger.log(`handleUnstakeIntents::${tokenInfo.symbol} Min unstake amount: ${minUnstakeAmount.toFixed(12)}`);
    if (eligibleUnstakeAmount.lt(minUnstakeAmount)) {
      this.logger.log(`handleUnstakeIntents::${tokenInfo.symbol} Eligible unstake amount is less than min unstake amount, skipping`);
      RelayerMonitoring.recordHandleUnstakeMetrics(tokenInfo.symbol, {
        eligibleUnstakeAmount: Number(eligibleUnstakeAmount.toString()),
        unprocessedWithdrawQueueAmount: Number(unprocessedWithdrawQueueAmount.toString()),
        intransitAmount: Number(intransitAmount.toString()),
        totalPendingUnstakeAmount: Number(totalPendingUnstakeAmount.toString()),
        totalUnstakedIn12hrs: Number(totalUnstakedIn12hrs.toString()),
        outcome: "skipped",
      });
      return;
    }
    
    // choose random validator
    // Randomly choose validators and search for delegator till we find
    let retry = 0;
    let suitableDelegator: PoolMemberInfo | null = null;
    while (retry < 3) {
      try {
        const randomValidator = this.validatorRegistryService.chooseStakeWeightedValidator(assetAddress);
        suitableDelegator = await this.delegatorService.chooseSuitableDelegatorToUnstake(randomValidator.address, assetAddress, eligibleUnstakeAmount);
        break;
      } catch (err) {
        this.logger.error(`handleUnstakeIntents::${tokenInfo.symbol} Error choosing suitable delegator: ${err}`, err);
        retry++;
      }
    }

    if (!suitableDelegator) {
      this.logger.log(`handleUnstakeIntents::${tokenInfo.symbol} No suitable delegator found, skipping`);
      return;
    }

    // create unstake intent
    await this.delegatorService.createUnstakeIntent(ContractAddr.from(suitableDelegator.delegator.address), assetAddress, eligibleUnstakeAmount);
    RelayerMonitoring.recordHandleUnstakeMetrics(tokenInfo.symbol, {
      eligibleUnstakeAmount: Number(eligibleUnstakeAmount.toString()),
      unprocessedWithdrawQueueAmount: Number(unprocessedWithdrawQueueAmount.toString()),
      intransitAmount: Number(intransitAmount.toString()),
      totalPendingUnstakeAmount: Number(totalPendingUnstakeAmount.toString()),
      totalUnstakedIn12hrs: Number(totalUnstakedIn12hrs.toString()),
      outcome: "done",
    });
  }

  // // todo unstake intent handling
  // todo cancel unstake intents if deposits are available (before staking them)
  // // todo, get unstaking requests older than 12 hours, still pending, use this amount to create intent
}
