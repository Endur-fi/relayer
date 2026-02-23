import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Contract } from "starknet";
import { ConfigService } from "./configService";
import { ABI as RelayerAbi } from "../../../abis/RelayerAbi";
import { getAddresses } from "../../common/constants";
import { getNetwork as getNetworkUtil } from "../../common/utils";
import { ContractAddr } from "@strkfarm/sdk";
import { RPCWrapper } from "./RPCWrapper";

export interface RelayerConfig {
  max_delegators: number;
  vrf: ContractAddr;
  delegator_class_hash: string;
  max_share_threshold_bps: bigint;
  max_commission_bps: number;
}

@Injectable()
export class RelayerServiceV2 {
  private readonly logger = new Logger(RelayerServiceV2.name);
  readonly relayerContract: Contract;
  readonly rpcWrapper: RPCWrapper;

  constructor(
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => RPCWrapper))
    rpcWrapper: RPCWrapper,
  ) {
    const relayerAddr = getAddresses(getNetworkUtil()).Relayer;
    this.relayerContract = new Contract({
      abi: RelayerAbi as any,
      address: relayerAddr.address,
      providerOrAccount: config.provider(),
    });
    this.rpcWrapper = rpcWrapper;
  }

  isConfigured(): boolean {
    const addr = getAddresses(getNetworkUtil()).Relayer.address;
    return !!addr && addr !== "0x0" && addr !== "";
  }

  async addDelegator(validator: ContractAddr): Promise<void> {
    const call = this.relayerContract.populate("add_delegator", [validator.address]);
    await this.rpcWrapper.executeTransactions(
      [call],
      `Relayer add_delegator for validator ${validator.address}`,
    );
  }

  async switchValidator(
    token: ContractAddr,
    delegator: ContractAddr,
    newValidator: ContractAddr,
  ): Promise<void> {
    const call = this.relayerContract.populate("switch_validator", [
      token.address,
      delegator.address,
      newValidator.address,
    ]);
    await this.rpcWrapper.executeTransactions(
      [call],
      `Relayer switch_validator token=${token.address} delegator=${delegator.address} new_validator=${newValidator.address}`,
    );
  }

  async stake(token: ContractAddr, amount: bigint | string): Promise<void> {
    const amountWei = typeof amount === "string" ? BigInt(amount) : amount;
    const call = this.relayerContract.populate("stake", [token.address, amountWei]);
    await this.rpcWrapper.executeTransactions(
      [call],
      `Relayer stake token=${token.address} amount=${amountWei}`,
    );
  }

  async unstakeAction(delegator: ContractAddr, token: ContractAddr): Promise<void> {
    const call = this.relayerContract.populate("unstake_action", [
      delegator.address,
      token.address,
    ]);
    await this.rpcWrapper.executeTransactions(
      [call],
      `Relayer unstake_action delegator=${delegator.address} token=${token.address}`,
    );
  }

  async startUnstake(token: ContractAddr, amount: bigint | string): Promise<void> {
    const amountWei = typeof amount === "string" ? BigInt(amount) : amount;
    const call = this.relayerContract.populate("start_unstake", [token.address, amountWei]);
    await this.rpcWrapper.executeTransactions(
      [call],
      `Relayer start_unstake token=${token.address} amount=${amountWei}`,
    );
  }

  async updateUnstake(token: ContractAddr): Promise<void> {
    const call = this.relayerContract.populate("update_unstake", [token.address]);
    await this.rpcWrapper.executeTransactions(
      [call],
      `Relayer update_unstake token=${token.address}`,
    );
  }

  /** get_supported_token returns (ContractAddress, length) tuple. */
  async getSupportedToken(index: number): Promise<ContractAddr> {
    const result = (await this.relayerContract.call("get_supported_token", [index])) as any;
    const addr = Array.isArray(result) ? result[0] : result?.address ?? result?.[0] ?? result;
    return ContractAddr.from(addr?.toString?.() ?? String(addr));
  }

  /** get_supported_token returns (ContractAddress, length). Returns the length (total count). */
  async getSupportedTokensLength(): Promise<number> {
    const result = (await this.relayerContract.call("get_supported_token", [0])) as any;
    const length = Array.isArray(result) ? result[1] : result?.length ?? result?.[1];
    return Number(length ?? 0);
  }

  async getUnstakeDelegators(): Promise<ContractAddr[]> {
    const result = await this.relayerContract.call("get_unstake_delegators", []);
    const arr = (result as any)?.length !== undefined ? result : (result as any)?.[0];
    if (!Array.isArray(arr)) return [];
    return arr.map((a: any) => ContractAddr.from(a?.toString?.() ?? String(a)));
  }

  async getConfig(): Promise<RelayerConfig> {
    const result = (await this.relayerContract.call("get_config", [])) as any;
    return {
      max_delegators: result?.max_delegators ?? 0,
      vrf: result?.vrf?.toString?.() ?? String(result?.vrf ?? ""),
      delegator_class_hash: result?.delegator_class_hash?.toString?.() ?? String(result?.delegator_class_hash ?? ""),
      max_share_threshold_bps: result?.max_share_threshold_bps != null ? BigInt(result.max_share_threshold_bps) : BigInt(0),
      max_commission_bps: result?.max_commission_bps ?? 0,
    };
  }

  async getMaxStake(token: ContractAddr): Promise<bigint> {
    const result = await this.relayerContract.call("get_max_stake", [token.address]);
    const val = (result as any)?.toString?.() ?? (result as any);
    return BigInt(val ?? 0);
  }

  async getValidatorStakeShare(validator: ContractAddr): Promise<bigint> {
    const result = await this.relayerContract.call("get_validator_stake_share", [
      validator.address,
    ]);
    const val = (result as any)?.toString?.() ?? (result as any);
    return BigInt(val ?? 0);
  }
}
