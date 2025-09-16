import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Contract } from "starknet";
import { ConfigService } from "./configService";
import { ABI as ValidatorRegistryAbi } from "../../../abis/ValidatorRegistryAbi";
import { getNetwork, STRK_TOKEN } from "../../common/utils";
import { getAddresses, getAllSupportedTokens, getLSTInfo, getTokenDecimals, getTokenInfoFromAddr } from "../../common/constants";
import { ContractAddr, Global, Web3Number } from "@strkfarm/sdk";
import { RPCWrapper, ViewCall } from "./RPCWrapper";
import validatorMeta from "../../common/validatorMeta.json";

interface IValidatorRegistryService {
  getValidatorsForToken(tokenAddress: ContractAddr): ValidatorInfo[];
  chooseRandomValidator(tokenAddress: ContractAddr): ValidatorInfo;
  claimRewards(validatorAddress: ContractAddr, tokenAddress: ContractAddr): void;
  stakeToDelegator(delegatorAddress: ContractAddr, tokenAddress: ContractAddr, amount: Web3Number): void;
}

export interface ValidatorInfo {
  address: ContractAddr,
  weight: number,
  isAllowed: boolean,
  supportedTokens: ValidatorTokenInfo[],
}

export interface DelegatorInfo {
  address: ContractAddr,
  validatorAddress: ContractAddr,
  index: number,
  isActive: boolean,
}

export interface ValidatorTokenInfo {
  tokenAddress: ContractAddr,
  isSupported: boolean,
  stakedAmount: Web3Number,
  pendingStakeAmount: Web3Number,
  lastEpoch: number,
  delegators: DelegatorInfo[],
}

@Injectable()
export class ValidatorRegistryService implements IValidatorRegistryService {
  private readonly logger = new Logger(ValidatorRegistryService.name);
  readonly validatorRegistry: Contract;
  readonly rpcWrapper: RPCWrapper;
  isInitialized: boolean = false;
  private validators: ValidatorInfo[] = [];

  constructor(
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => RPCWrapper))
    rpcWrapper: RPCWrapper
  ) {
    this.validatorRegistry = new Contract({
      abi: ValidatorRegistryAbi, 
      address: getAddresses(getNetwork()).ValidatorRegistry.address, 
      providerOrAccount: config.provider()});
    this.rpcWrapper = rpcWrapper;
  }

  async onModuleInit() {
    // load all active validators
    const _validators = await this._getValidators();
    this.validators = _validators.filter((validator) => validator.isAllowed);

    // load all supported tokens for each validator
    for (const validator of this.validators) {
      validator.supportedTokens = (await Promise.all(getAllSupportedTokens().map(async (token) => {
        const tokenInfo = await this.getValidatorTokenInfo(validator.address, token);
        return tokenInfo;
      }))).filter((token) => token.isSupported);

      // load all delegators for each validator
      for (const token of validator.supportedTokens) {
        token.delegators = [...token.delegators, ...(await this._getDelegators(validator.address, token.tokenAddress))];
      }
    }

    this.isInitialized = true;

    await this.logValidatorsAsTable();
  }

  stakeToDelegator(delegatorAddress: ContractAddr, tokenAddress: ContractAddr, amount: Web3Number) {
    return this.validatorRegistry.populate("stake_to_validator", [delegatorAddress.address, tokenAddress.address, amount.toWei()]);
    // await this.rpcWrapper.executeTransactions([call], `Stake to validator: ${delegatorAddress.address} for token: ${tokenAddress.address} with amount: ${amount.toString()}`);
  }

  /**
   * Get all validators for a token that have at least one active delegator
   * @param tokenAddress 
   * @returns 
   */
  getValidatorsForToken(tokenAddress: ContractAddr) {
    return this.validators
      .filter((validator) => validator.isAllowed)
      .filter((validator) => validator.supportedTokens.some((token) => {
        return token.tokenAddress.eqString(tokenAddress.address) && token.delegators.some((delegator) => delegator.isActive);
      }))
  }

  getValidatorDelegators(validatorAddress: ContractAddr, tokenAddress: ContractAddr, includeInactive: boolean = false) {
    const validator = this.validators
      .filter((validator) => validator.address.eqString(validatorAddress.address))
      .filter((validator) => validator.supportedTokens.some((token) => token.tokenAddress.eqString(tokenAddress.address)))[0];
    if (!validator) {
      throw new Error(`Validator not found for token: ${tokenAddress.address}`);
    }
    const tokenInfo = validator.supportedTokens.find((token) => token.tokenAddress.eqString(tokenAddress.address));
    if (!tokenInfo) {
      throw new Error(`Token not found for validator: ${validatorAddress.address}`);
    }
    return tokenInfo.delegators.filter((delegator) => includeInactive || delegator.isActive);
  }

  // use validator weights to choose a random validator
  chooseRandomValidator(tokenAddress: ContractAddr) {
    const validValidators = this.getValidatorsForToken(tokenAddress);
    if (validValidators.length === 0) {
      throw new Error(`No validators found for token: ${tokenAddress.address}`);
    }

    // get total weight
    const totalWeight = validValidators
      .reduce((acc, validator) => acc + validator.weight, 0);
    const randomWeight = Math.random() * totalWeight;
    this.logger.verbose(`chooseRandomValidator randomWeight: ${randomWeight} for token: ${tokenAddress.address} and totalWeight: ${totalWeight}`);

    // choose a random validator
    let cumulativeWeight = 0;
    for (const validator of validValidators) {
      cumulativeWeight += validator.weight;
      if (randomWeight <= cumulativeWeight) {
        return validator;
      }
    }
    throw new Error(`No validator found for token: ${tokenAddress.address}`);
  }

  async claimRewards(validatorAddress: ContractAddr, tokenAddress: ContractAddr) {
    const call = this.validatorRegistry.populate("claim_rewards_for_validator", [validatorAddress.address, tokenAddress.address]);
    await this.rpcWrapper.executeTransactions([call], `Claim rewards for validator: ${validatorAddress.address} and token: ${tokenAddress.address}`);
  }

  async getUnassignedAmount(tokenAddress: ContractAddr) {
    const call = this.validatorRegistry.populate("get_unassigned_stake", [tokenAddress.address]);
    const amount = await this.rpcWrapper.aggregateViewCall<bigint>({
      ...call, abi: ValidatorRegistryAbi
    });
    return Web3Number.fromWei(amount.toString(), await getTokenDecimals(tokenAddress));
  }

  generateBellCurveWeights(numDelegators: number) {
    const weights = [];
    const center = (numDelegators - 1) / 2;
    const sigma = numDelegators / 6;
    
    let totalWeight = 0;
    
    for (let i = 0; i < numDelegators; i++) {
      const weight = Math.exp(-Math.pow(i - center, 2) / (2 * Math.pow(sigma, 2)));
      weights.push(weight);
      totalWeight += weight;
    }
    
    return weights.map(w => w / totalWeight);
  }

  private async _getValidators(): Promise<ValidatorInfo[]> {
    // get the length of the validators
    const validatorsLen = await this.rpcWrapper.aggregateViewCall<number>({
      ...this.validatorRegistry.populate("get_total_validators", []), abi: ValidatorRegistryAbi
    });
    this.logger.verbose(`getValidators len: ${validatorsLen}`);

    // multicall to get all validators
    const validatorInfoCalls: ViewCall[] = [];
    for (let i = 0; i < validatorsLen; i++) {
      validatorInfoCalls.push({
        ...this.validatorRegistry.populate("get_validator_by_index", [i]), abi: ValidatorRegistryAbi
      });
    }
    const _validators = await this.rpcWrapper.aggregateViewCalls<any[]>(validatorInfoCalls);

    // parse the results
    const validators: ValidatorInfo[] = _validators.map((validator) => ({
        address: ContractAddr.from(validator.address),
        weight: Number(validator.weight),
        isAllowed: validator.is_allowed,
        supportedTokens: [], // do separate call to get supported tokens
        delegators: [], // do separate call to get delegators
    }));
    return validators;
  }

  private async _getDelegators(validatorAddress: ContractAddr, tokenAddress: ContractAddr): Promise<DelegatorInfo[]> { 
    // get the length of the delegators
    const delegatorsLen = await this.rpcWrapper.aggregateViewCall<number>({
      ...this.validatorRegistry.populate("get_total_delegators_for_validator", [validatorAddress.address, tokenAddress.address]), abi: ValidatorRegistryAbi
    });
    this.logger.verbose(`getDelegators len: ${delegatorsLen} for validator: ${validatorAddress.address} and token: ${tokenAddress.address}`);
   
    // multicall to get all delegators
    const delegatorInfoCalls: ViewCall[] = [];
    for (let i = 0; i < delegatorsLen; i++) {
      delegatorInfoCalls.push({
        ...this.validatorRegistry.populate("get_delegator_by_index", [validatorAddress.address, tokenAddress.address, i]), abi: ValidatorRegistryAbi
      });
    }
    const _delegators = await this.rpcWrapper.aggregateViewCalls<any[]>(delegatorInfoCalls);

    // parse the results
    const delegators: DelegatorInfo[] = _delegators.map((delegator) => ({
      address: ContractAddr.from(delegator['0']),
      validatorAddress: ContractAddr.from(delegator['1'].validator_address),
      index: Number(delegator['1'].delegator_index),
      isActive: delegator['1'].is_active,
    }));
    this.logger.verbose(`getDelegators: ${JSON.stringify(delegators)}`);
    return delegators;
  }

  async getValidatorTokenInfo(validatorAddress: ContractAddr, tokenAddress: ContractAddr): Promise<ValidatorTokenInfo> {
    const validatorTokenInfo = await this.rpcWrapper.aggregateViewCall<any>({
      ...this.validatorRegistry.populate("get_validator_token_info", [validatorAddress.address, tokenAddress.address]), abi: ValidatorRegistryAbi
    });
    this.logger.verbose(`getValidatorTokenInfo: ${JSON.stringify(validatorTokenInfo)}`);
    const tokenMetadata = await getTokenInfoFromAddr(tokenAddress);
    return {
      isSupported: validatorTokenInfo.is_supported,
      stakedAmount: Web3Number.fromWei(validatorTokenInfo.staked_amount, tokenMetadata.decimals),
      pendingStakeAmount: Web3Number.fromWei(validatorTokenInfo.pending_stake_amount, tokenMetadata.decimals),
      lastEpoch: Number(validatorTokenInfo.last_epoch),
      tokenAddress: tokenAddress,
      delegators: [],
    }
  }

  private async logValidatorsAsTable() {
    const network: 'sepolia' | 'mainnet' = getNetwork().toString() as 'sepolia' | 'mainnet';
    const rows: any[] = [];
    for (const validator of this.validators) {
      const valMeta = validatorMeta[network].find((v) => ContractAddr.from(v.validator).eqString(validator.address.address));
      for (const token of validator.supportedTokens) {
        const tokenMeta = await getTokenInfoFromAddr(token.tokenAddress);
        rows.push({
          validator: validator.address.address,
          name: valMeta?.name || "Unknown",
          weight: validator.weight.toString(),
          isAllowed: validator.isAllowed.toString(),
          token: tokenMeta.symbol,
          delegators: token.delegators.map((delegator) => delegator.address.address).join(", "),
          stakedAmount: token.stakedAmount.toString(),
          pendingStakeAmount: token.pendingStakeAmount.toString(),
        });
      }
    }
    console.table(rows);
  }
}
