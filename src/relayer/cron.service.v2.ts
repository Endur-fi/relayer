import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ContractAddr, Web3Number } from "@strkfarm/sdk";
import { getLSTInfo, getTokenDecimals, getTokenInfoFromAddr } from "../common/constants";
import { TryCatchAsync } from "../common/utils";
import { ConfigService } from "./services/configService";
import { NotifService } from "./services/notifService";
import { PrismaService } from "./services/prismaService";
import { RelayerServiceV2 } from "./services/relayerServiceV2";
import { WithdrawalQueueService } from "./services/withdrawalQueueService";
import { ValidatorRegistryService } from "./services/validatorRegistryService";
import { DelegatorService } from "./services/delegatorService";

function getCronSettingsV2(
  action: "stake" | "unstake-action" | "start-unstake" | "update-unstake"
): string {
  const config = new ConfigService();
  switch (action) {
    case "stake":
      return config.isSepolia() ? CronExpression.EVERY_10_MINUTES : "20 0-23/12 * * *";
    case "unstake-action":
      return config.isSepolia() ? CronExpression.EVERY_5_MINUTES : "20 0-23/1 * * *";
    case "start-unstake":
      return config.isSepolia() ? CronExpression.EVERY_10_MINUTES : "5 0-23/12 * * *";
    case "update-unstake":
      return config.isSepolia() ? CronExpression.EVERY_5_MINUTES : "5 0-23/12 * * *";
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

@Injectable()
export class CronServiceV2 {
  private readonly logger = new Logger(CronServiceV2.name);

  readonly relayerServiceV2: RelayerServiceV2;
  readonly config: ConfigService;
  readonly notifService: NotifService;
  readonly prismaService: PrismaService;
  readonly withdrawalQueueService: WithdrawalQueueService;
  readonly validatorRegistryService: ValidatorRegistryService;
  readonly delegatorService: DelegatorService;

  constructor(
    @Inject(forwardRef(() => RelayerServiceV2))
    relayerServiceV2: RelayerServiceV2,
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => NotifService))
    notifService: NotifService,
    @Inject(forwardRef(() => PrismaService))
    prismaService: PrismaService,
    @Inject(forwardRef(() => WithdrawalQueueService))
    withdrawalQueueService: WithdrawalQueueService,
    @Inject(forwardRef(() => ValidatorRegistryService))
    validatorRegistryService: ValidatorRegistryService,
    @Inject(forwardRef(() => DelegatorService))
    delegatorService: DelegatorService,
  ) {
    this.relayerServiceV2 = relayerServiceV2;
    this.config = config;
    this.notifService = notifService;
    this.prismaService = prismaService;
    this.withdrawalQueueService = withdrawalQueueService;
    this.validatorRegistryService = validatorRegistryService
    this.delegatorService = delegatorService
  }

  @TryCatchAsync()
  async onModuleInit() {
    console.log("Running task on application start")

    // todo: not sure what to put here
  }

  @Cron(getCronSettingsV2("stake"))
  @TryCatchAsync(3, 10000)
  async jobStake() {
    if (!this.relayerServiceV2.isConfigured()) {
      this.logger.debug("Relayer V2 not configured, skipping stake job");
      return;
    }
    let len = await this.relayerServiceV2.getSupportedTokensLength();
    if (len === 0) {
      this.logger.debug("No supported tokens from Relayer config");
      return;
    }
    this.logger.log("Handling un-assigned stakes")
    for (let i = 0; i < len; i++) {
      try {
        let token = await this.relayerServiceV2.getSupportedToken(i)
        const lstInfo = getLSTInfo(token);
        let unassignedAmount = await this.validatorRegistryService.getUnassignedAmount(token)
        if (unassignedAmount.gt(lstInfo.minWithdrawalAutoProcessAmount.multipliedBy(100))) {
          this.logger.log(`Staking unassigned stake ${unassignedAmount.toString()} ${token.address}`);
          await this._stakeFundsRelayer(token, unassignedAmount)
        }
      } catch (err: any) {
        this.logger.error(`stake job failed for index ${i}:`, err);
        this.notifService.sendMessage(`Relayer V2 stake error: ${err?.message ?? err}`);
      }
    }

    this.logger.log("handling assigned stakes")
    for (let i = 0; i < len; i++) {
      try {
        const token = await this.relayerServiceV2.getSupportedToken(i)
        const lstInfo = getLSTInfo(token);
        const tokenInfo = await getTokenInfoFromAddr(token)
        const validators = this.validatorRegistryService.getValidatorsForToken(token);
        for (const validator of validators) {
          let validatorTokenInfo = await this.validatorRegistryService.getValidatorTokenInfo(validator.address, token);
          if (validatorTokenInfo.pendingStakeAmount.gt(lstInfo.minWithdrawalAutoProcessAmount.multipliedBy(100))) {
            await this._stakeFundsValidator(token, validator.address, validatorTokenInfo.pendingStakeAmount, true)
          } else {
            this.logger.log(`${tokenInfo.symbol} No pending stake amount for validator ${validator.address.address} ${token.address}`);
          }
        }
      } catch(err: any) {
        this.logger.error(`stake job failed for index ${i}:`, err);
        this.notifService.sendMessage(`Relayer V2 stake error: ${err?.message ?? err}`);
      }
    }
  }

  async _stakeFundsValidator(token: ContractAddr, validator: ContractAddr, amount: Web3Number, isAssigned: boolean) {
    this.logger.verbose(`Staking funds: ${amount.toString()}, tokenAddress: ${token.address}, validatorAddress: ${validator.address}, isAssignedStake: ${isAssigned}`);
    const tokenInfo = await getTokenInfoFromAddr(token);
    const maxStake = await this.relayerServiceV2.getMaxStake(token);
    const maxStakeWeb3 = Web3Number.fromWei(maxStake.toString(), tokenInfo.decimals);

    let stakeAmount = amount.gt(maxStakeWeb3) ? maxStakeWeb3 : amount;
    this.logger.log(`Staking ${stakeAmount.toString()}, totalAmount: ${amount.toString()} ${tokenInfo.symbol} to validator ${validator.address}, isAssignedStake: ${isAssigned}`);
    await this.delegatorService.stakeToValidator(validator, token, stakeAmount, isAssigned);

    let remainingAmount = amount.minus(stakeAmount);
    this.logger.verbose(`${tokenInfo.symbol} Remaining amount to stake: ${remainingAmount.toString()}`);
    if (remainingAmount.gt(0)) {
      await this._stakeFundsValidator(token, validator, remainingAmount, true);
    }
  }

  async _stakeFundsRelayer(token: ContractAddr, amount: Web3Number) {
    this.logger.verbose(`Staking funds: ${amount.toString()}, tokenAddress: ${token.address}`);
    const tokenInfo = await getTokenInfoFromAddr(token);
    const maxStake = await this.relayerServiceV2.getMaxStake(token);
    const maxStakeWeb3 = Web3Number.fromWei(maxStake.toString(), tokenInfo.decimals);

    let stakeAmount = amount.gt(maxStakeWeb3) ? maxStakeWeb3 : amount;
    this.logger.log(`Staking ${stakeAmount.toString()}, totalAmount: ${amount.toString()} ${tokenInfo.symbol} to validator`);
    await this.relayerServiceV2.stake(token, BigInt(stakeAmount.toWei()));

    let remainingAmount = amount.minus(stakeAmount)
    this.logger.verbose(`${tokenInfo.symbol} Remaining amount to stake: ${remainingAmount.toString()}`);
    if (remainingAmount.gt(0)) {
      await this._stakeFundsRelayer(token, remainingAmount);
    }
  }

  @Cron(getCronSettingsV2("update-unstake"))
  @TryCatchAsync(3, 10000)
  async jobUpdateUnstake() {
    if (!this.relayerServiceV2.isConfigured()) {
      this.logger.debug("Relayer V2 not configured, skipping update-unstake job")
      return
    }
    this.logger.log("Updating unstake for delegators ")
    const len = await this.relayerServiceV2.getSupportedTokensLength()
    for (let i = 0; i<len; i++) {
      let token = await this.relayerServiceV2.getSupportedToken(i)
      await this._updateUnstake(token)
    }
  }

  async _updateUnstake(token: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(token);
    try {
      this.logger.log(`updating delegators stake req for token ${tokenInfo.symbol} and address ${token.address}`)
      await this.relayerServiceV2.updateUnstake(token)
    } catch(err: any) {
      this.logger.error(`updating delegators stake failed for token ${tokenInfo.symbol} and address ${token.address}`)
    }
  }

  @Cron(getCronSettingsV2("start-unstake"))
  @TryCatchAsync(3, 10000)
  async jobStartUnstake() {
    if (!this.relayerServiceV2.isConfigured()) {
      this.logger.debug("Relayer V2 not configured, skipping start_unstake job");
      return;
    }
    const len = await this.relayerServiceV2.getSupportedTokensLength();
    if (len === 0) {
      this.logger.debug("No supported tokens from Relayer config");
      return;
    }
    for (let i = 0; i < len; i++) {
      const token = await this.relayerServiceV2.getSupportedToken(i);
      try {
        await this._handleStartUnstake(token)
      } catch (err) {
        this.logger.error(`handleUnstakeIntents::${token.address} Error handling unstake intents: ${err}`, err);
        this.notifService.sendMessage(`handleUnstakeIntents::${token.address} Error handling unstake intents: ${err}`);
      }
    }
  }

  async _handleStartUnstake(token: ContractAddr) {
    const lstInfo = getLSTInfo(token);
    const tokenInfo = await getTokenInfoFromAddr(token);
    const [pendingWithdraws] = await this.prismaService.getPendingWithdraws(
      token,
      lstInfo.minWithdrawalAutoProcessAmount,
    );
    const totalPending = pendingWithdraws.reduce(
      (acc, w) => acc.plus(Web3Number.fromWei(w.amount, tokenInfo.decimals)),
      new Web3Number(0, tokenInfo.decimals),
    );
    const totalUnstakedIn12hrs = pendingWithdraws
      .filter((w) => w.timestamp >= (Date.now() - 12 * 60 * 60 * 1000) / 1000)
      .reduce(
        (acc, w) => acc.plus(Web3Number.fromWei(w.amount, tokenInfo.decimals)),
        new Web3Number(0, tokenInfo.decimals),
      );
    const wqState = await this.withdrawalQueueService.getWithdrawalQueueState(token);
    const intransit = wqState.intransit_amount;
    const unprocessed = wqState.unprocessed_withdraw_queue_amount;
    const eligible = totalPending.minus(intransit).minus(totalUnstakedIn12hrs).minimum(unprocessed);
    if (eligible.lt(lstInfo.minUnstakeAmount)) {
      this.logger.debug(`start_unstake skip token=${token.address}: eligible ${eligible.toString()} < min ${lstInfo.minUnstakeAmount.toString()}`);
      return
    }
    const amountWei = eligible.toWei();
    await this.relayerServiceV2.startUnstake(token, amountWei);
    this.notifService.sendMessage(`Relayer V2 start_unstake token=${token.address} amount=${amountWei}`);
  }

  @Cron(getCronSettingsV2("unstake-action"))
  @TryCatchAsync(3, 10000)
  async jobUnstakeAction() {
    if (!this.relayerServiceV2.isConfigured()) {
      this.logger.debug("Relayer V2 not configured, skipping unstake_action job");
      return;
    }
    const delegators = await this.relayerServiceV2.getUnstakeDelegators()
    let len = await this.relayerServiceV2.getSupportedTokensLength()
    if (len === 0) {
      this.logger.debug("No supported tokens from Relayer config");
      return;
    }
    this.logger.log("Handling Unstake Action")
    for (let i = 0; i < len; i++) {
      try {
        const token = await this.relayerServiceV2.getSupportedToken(i)
        for (let j = 0; j< delegators.length; j++) {
          await this.relayerServiceV2.unstakeAction(delegators[i], token)
        }
      } catch(err: any) {
        this.logger.error('unstake action failed')
      }
    }
  }
}
