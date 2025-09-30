import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ContractAddr, Global, Web3Number } from "@strkfarm/sdk";
import { CairoOption, Contract } from "starknet";

import { ConfigService } from "./configService";
import { ABI as DelegatorAbi } from "../../../abis/Delegator";
import { getAddresses, getLSTDecimals, getLSTInfo, getTokenDecimals, getTokenInfoFromAddr } from "../../common/constants";
import { RPCWrapper } from "./RPCWrapper";
import { DelegatorInfo, ValidatorRegistryService } from "./validatorRegistryService";

export interface PoolMemberInfo {
  delegator: Contract;
  rewardAddress: string;
  amount: Web3Number;
  unclaimedRewards: Web3Number;
  unPoolAmount: Web3Number;
  unPoolTime: Date | null;
}

interface IDelegatorService {
  getPoolMemberInfo(delegatorAddress: ContractAddr, tokenAddress: ContractAddr): Promise<PoolMemberInfo>;
  getUnstakeAmounts(tokenAddress: ContractAddr): Promise<PoolMemberInfo[]>; // returns the amount of funds that can be unstaked
  getTotalUnclaimedRewards(tokenAddress: ContractAddr): Promise<{ validatorAddress: ContractAddr; amount: number }[]>;
}

@Injectable()
export class DelegatorService implements IDelegatorService {
  private readonly logger = new Logger(DelegatorService.name);
  readonly config: ConfigService;
  readonly rpcWrapper: RPCWrapper;
  readonly validatorRegistryService: ValidatorRegistryService;

  constructor(
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => RPCWrapper))
    rpcWrapper: RPCWrapper,
    @Inject(forwardRef(() => ValidatorRegistryService))
    validatorRegistryService: ValidatorRegistryService
  ) {
    this.config = config;
    this.rpcWrapper = rpcWrapper;
    this.validatorRegistryService = validatorRegistryService;
  }

  getDelegator(delegatorAddress: ContractAddr) {
    return new Contract({abi: DelegatorAbi, address: delegatorAddress.address, providerOrAccount: this.config.provider()});
  }

  async getPoolMemberInfo(delegatorAddress: ContractAddr, tokenAddress: ContractAddr): Promise<PoolMemberInfo> {
    const tokenDecimals = await getTokenDecimals(tokenAddress);
    try {
      const result: any = await this.rpcWrapper.aggregateViewCall({
        ...this.getDelegator(delegatorAddress).populate("get_pool_member_info", [tokenAddress.address]), abi: DelegatorAbi
      });

      // {
      //   reward_address: 1254925468566415475020808191746114863081461075213051000422250263239065616617n,
      //   amount: 9011093044960616394675n,
      //   unclaimed_rewards: 61882242543753629n,
      //   commission: 0n,
      //   unpool_amount: 261000000000000000000000n,
      //   unpool_time: CairoOption { Some: { seconds: 1750930665n }, None: undefined }
      // }
      const unPoolTimeOption: CairoOption<{ seconds: bigint }> =
        result.unpool_time;
      return {
        delegator: this.getDelegator(delegatorAddress),
        rewardAddress: result.reward_address.toString(),
        amount: Web3Number.fromWei(result.amount.toString(), tokenDecimals),
        unclaimedRewards: Web3Number.fromWei(
          result.unclaimed_rewards.toString(),
          tokenDecimals
        ),
        unPoolAmount: Web3Number.fromWei(
          result.unpool_amount.toString(),
          tokenDecimals
        ),
        unPoolTime: unPoolTimeOption.Some
          ? new Date(Number(unPoolTimeOption.Some.seconds.toString()) * 1000)
          : null,
      };
    } catch (err: any) {
      if (err.message.includes("Pool member does not exist")) {
        return {
          delegator: this.getDelegator(delegatorAddress),
          rewardAddress: '',
          amount: Web3Number.fromWei(0, tokenDecimals),
          unclaimedRewards: Web3Number.fromWei(0, tokenDecimals),
          unPoolAmount: Web3Number.fromWei(0, tokenDecimals),
          unPoolTime: null,
        }
      }
      throw err;
    }
  }

  async getTotalUnclaimedRewards(tokenAddress: ContractAddr) {
    const validators = this.validatorRegistryService.getValidatorsForToken(tokenAddress);
    
    const output = await Promise.all(validators
      .map(async (validator) => {
        const delegators = this.validatorRegistryService.getValidatorDelegators(validator.address, tokenAddress);
        const proms = delegators.map((delegator) => {
          return this.getPoolMemberInfo(delegator.address, tokenAddress);
        });
        const result = await Promise.all(proms);
        return {
          validatorAddress: validator.address,
          amount: result.reduce((acc, info) => acc + Number(info.unclaimedRewards.toString()), 0)
        };
      }));
    return output;
  }

  async getUnstakeAmounts(tokenAddress: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(tokenAddress);
    const validators = this.validatorRegistryService.getValidatorsForToken(tokenAddress);
    // true bcz need to unstake even when inactive
    const allDelegators = validators.flatMap((validator) => this.validatorRegistryService.getValidatorDelegators(validator.address, tokenAddress, true));11
    const proms = allDelegators.map((del) => {
      return this.getPoolMemberInfo(del.address, tokenAddress);
    });
    const result = (await Promise.all(proms)).filter(async (info) =>
      info.unPoolAmount.gt(Web3Number.fromWei("0", tokenInfo.decimals))
    );
    this.logger.debug(
      `${tokenInfo.symbol} Unstake amounts`,
      result.map((info) => ({
        delegator: info.delegator.address,
        unPoolAmount: info.unPoolAmount.toString(),
        unPoolTime: info.unPoolTime,
      }))
    );
    return result;
  }

  /**
   * 
   * @param validatorAddress 
   * @param tokenAddress 
   * @param amount 
   * @param isAssignedStake if true, the stake is assigned to the validator, otherwise it is distributed to the delegators
   */
  async stakeToValidator(validatorAddress: ContractAddr, tokenAddress: ContractAddr, amount: Web3Number, isAssignedStake: boolean = false) {
    this.logger.log(`Staking to validator: ${validatorAddress.address} for token: ${tokenAddress.address} with amount: ${amount.toString()}, isAssignedStake: ${isAssignedStake}`);
    const lstInfo = getLSTInfo(tokenAddress);
    if (amount.gt(lstInfo.maxStakePerTx) && !isAssignedStake) {
      throw new Error(`Amount to stake to validator: ${validatorAddress.address} for token: ${tokenAddress.address} is greater than the max stake per tx: ${lstInfo.maxStakePerTx}`);
    }

    // get validator delegators
    const validatorDetails = this.validatorRegistryService.getValidatorsForToken(tokenAddress)
      .find((validator) => validator.address.eqString(validatorAddress.address));
    if (!validatorDetails) {
      throw new Error(`Validator: ${validatorAddress.address} not found for token: ${tokenAddress.address}`);
    }
    const _delegators = this.validatorRegistryService.getValidatorDelegators(validatorAddress, tokenAddress);

    // ! bad jugaad due to upgrade issue in sepolia. 
    // Skip this delegator as there is no way to call enter_delegation as present. 
    const delegators = _delegators.filter((delegator) => !delegator.address.eqString('0x246f8bf539817de93d5fac4eca0052ba40e684a5ddddd7b7027f1744e3d927f'));

    // get current staked amount distribution
    const delegatorStakes = await this.getDelegatorsStakeInfo(delegators, tokenAddress);
    const stakeDistributions = await this.getIdealAssetDistribution(delegatorStakes, amount, tokenAddress);
    this.logger.verbose(`${tokenAddress.address} Stake distributions: ${JSON.stringify(stakeDistributions)}`);

    
    const calls = stakeDistributions.map((distribution) => this.validatorRegistryService.stakeToDelegator(distribution.delegator, tokenAddress, distribution.amount));
    
    await this.rpcWrapper.executeTransactions(calls, `Staked to validator: ${validatorAddress.address} for token: ${tokenAddress.address} with amount: ${amount.toString()}`);
  }

  async getIdealAssetDistribution(delegators: PoolMemberInfo[], newAmount: Web3Number, tokenAddress: ContractAddr) {
    const tokenInfo = await getTokenInfoFromAddr(tokenAddress);
    const lstInfo = getLSTInfo(tokenAddress);
    const minPerStakeAmount = lstInfo.minWithdrawalAutoProcessAmount.multipliedBy(100);

    const totalStakedAmount = delegators.reduce((acc, info) => acc.plus(info.amount), Web3Number.fromWei("0", tokenInfo.decimals));
    this.logger.verbose(`${tokenInfo.symbol} Total staked amount: ${totalStakedAmount.toString()}`);

    const newTotalStakedAmount = totalStakedAmount.plus(newAmount);
    this.logger.verbose(`${tokenInfo.symbol} New total staked amount: ${newTotalStakedAmount.toString()}`);

    const expectedAssetDistribution = this.validatorRegistryService.generateBellCurveWeights(delegators.length);
    this.logger.verbose(`Expected asset distribution: ${JSON.stringify(expectedAssetDistribution)}`);

    // calculate ideal asset distribution
    const idealAssetDistribution = expectedAssetDistribution.map((weight, index) => ({
      delegator: delegators[index].delegator.address,
      amount: newTotalStakedAmount.multipliedBy(weight),
    }));
    this.logger.verbose(`${tokenInfo.symbol} Ideal asset distribution: ${JSON.stringify(idealAssetDistribution)}`);

    // order delegators by amount asc
    const orderedDelegators = idealAssetDistribution.sort((a, b) => a.amount.cmp(b.amount));
    this.logger.verbose(`${tokenInfo.symbol} Ordered delegators: ${JSON.stringify(orderedDelegators.map((d) => ({
      delegator: d.delegator,
      amount: d.amount.toString(),
    })))}`);

    // use new amount to distribute to delegators
    let distributions: { delegator: ContractAddr; amount: Web3Number }[] = [];
    let remainingAmount = newAmount;
    const logData: any[] = [];
    for (let i = 0; i < orderedDelegators.length; i++) {
      const delegator = delegators.find((d) => d.delegator.address === orderedDelegators[i].delegator);
      if (!delegator) {
        throw new Error(`Delegator: ${orderedDelegators[i].delegator} not found`);
      }
      const idealAmount = orderedDelegators[i];
      const currentAmount = delegator.amount;
      const addition = idealAmount.amount.minus(currentAmount).minimum(remainingAmount);
      this.logger.verbose(`${tokenInfo.symbol} delegator: ${delegator.delegator.address} idealAmount: ${idealAmount.amount.toString()} currentAmount: ${currentAmount.toString()} addition: ${addition.toString()}`);
      if (addition.gt(minPerStakeAmount)) {
        distributions.push({
          delegator: ContractAddr.from(delegator.delegator.address),
          amount: addition,
        });
        remainingAmount = remainingAmount.minus(addition);
      }

      // log the distribution
      this.logger.verbose(`${tokenInfo.symbol} Adding ${addition.toString()} to delegator: ${delegator.delegator.address}`);
      logData.push({
        delegator: delegator.delegator.address,
        addition: addition.toString(),
        currentAmount: currentAmount.toString(),
        idealAmount: idealAmount.amount.toString()
      });
    }

    // minWithdrawalAutoProcessAmount is not the right variable name,
    // just needed a small enough value to compare, this seems good enough
    if (remainingAmount.gt(minPerStakeAmount.multipliedBy(10))) {
      throw new Error(`${tokenInfo.symbol} Remaining amount: ${remainingAmount.toString()} is greater than 0`);
    }

    // log the table of distributions
    console.table(logData);

    return distributions;
  }

  async getDelegatorsStakeInfo(delegators: DelegatorInfo[], tokenAddress: ContractAddr): Promise<PoolMemberInfo[]> {
    const tokenInfo = await getTokenInfoFromAddr(tokenAddress);
    const proms = delegators.map((delegator) => {
      return this.getPoolMemberInfo(delegator.address, tokenAddress);
    });
    const result = await Promise.all(proms);
    this.logger.verbose(`${tokenInfo.symbol} Delegator stakes: ${JSON.stringify(result.map((r) => ({
      delegator: r.delegator.address,
      amount: r.amount.toString(),
      unclaimedRewards: r.unclaimedRewards.toString(),
      unPoolAmount: r.unPoolAmount.toString(),
      unPoolTime: r.unPoolTime,
    })))}`);
    return result;
  }

  async chooseSuitableDelegatorToUnstake(validatorAddress: ContractAddr, tokenAddress: ContractAddr, unstakeAmount: Web3Number) {
    // Conditions:
    // 1. No pending unstake amount for the delegator
    // 2. Delegator that can max utilize the stake to unstake 
    // (i.e. if two delegators with 100 and 200 stake each, if unstake is 99, use first one)
    const delegators = this.validatorRegistryService.getValidatorDelegators(validatorAddress, tokenAddress);
    if (delegators.length === 0) {
      throw new Error(`No delegators found for validator: ${validatorAddress.address}`);
    }
    const tokenInfo = await getTokenInfoFromAddr(tokenAddress);

    const delegatorStakes = await this.getDelegatorsStakeInfo(delegators, tokenAddress);
    
    this.logger.log(`chooseSuitableDelegatorToUnstake::${tokenInfo.symbol} - unstake amount: ${unstakeAmount.toString()}`);
    console.table(delegatorStakes);

    const suitableDelegators = delegatorStakes
      // pools without any pending unstake
      .filter((d) => !d.unPoolAmount || d.unPoolAmount.isZero())
      // 
      .filter((d) => d.amount.greaterThanOrEqualTo(unstakeAmount))
      .sort((a, b) => {
        return a.amount.toNumber() - b.amount.toNumber();
      });
    
    this.logger.log(`chooseSuitableDelegatorToUnstake::${tokenInfo.symbol}`);
    console.table(suitableDelegators);

    const suitableDelegator = suitableDelegators[0];
    if (!suitableDelegator) {
      throw new Error(`No suitable delegator found for validator: ${validatorAddress.address}`);
    }

    this.logger.log(`Suitable delegator found for validator: ${validatorAddress.address} is ${suitableDelegator.delegator.address}`);
    return suitableDelegator;
  }

  async createUnstakeIntent(delegatorAddress: ContractAddr, tokenAddress: ContractAddr, unstakeAmount: Web3Number) {
    const delegator = this.getDelegator(delegatorAddress);
    const call = delegator.populate("start_unstake_intent", [tokenAddress.address, unstakeAmount.toWei()]);
    const tokenInfo = await getTokenInfoFromAddr(tokenAddress);
    await this.rpcWrapper.executeTransactions([call], `Unstaking from delegator: ${delegatorAddress.address} for token: ${tokenAddress.address} with amount: ${unstakeAmount.toString()} ${tokenInfo.symbol}`);
  }
}
