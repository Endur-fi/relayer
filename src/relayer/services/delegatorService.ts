import { Injectable, Logger } from "@nestjs/common";
import { CairoOption, Contract } from "starknet";
import { getAddresses, getLSTDecimals } from "../../common/constants";
import { ConfigService } from "./configService";
import { ABI as DelegatorAbi } from '../../../abis/Delegator';
import { Web3Number } from "@strkfarm/sdk";

interface PoolMemberInfo {
  delegator: Contract,
  rewardAddress: string,
  amount: Web3Number,
  index: string,
  unclaimedRewards: Web3Number,
  unPoolAmount: Web3Number,
  unPoolTime: Date | null
}

interface IDelegatorService {
  getPoolMemberInfo(delegatorIndex: number): Promise<PoolMemberInfo>;
  getUnstakeAmounts(): Promise<PoolMemberInfo[]>; // returns the amount of funds that can be unstaked
  unstakeAction(): Promise<void>; // claims unstaked funds
  getTotalUnclaimedRewards(): Promise<number>;
}

@Injectable()
export class DelegatorService implements IDelegatorService {
  private readonly logger = new Logger(DelegatorService.name);
  readonly delegators: Contract[] = [];

  constructor(
    config: ConfigService
  ) {
    this.delegators = getAddresses(config.get("network"))
      .Delgator.map((del) => {
        return new Contract(
          DelegatorAbi,
          del,
          config.provider()
        );
      });
  }

  async getPoolMemberInfo(delegatorIndex: number): Promise<PoolMemberInfo> {
    const result: any = await this.delegators[delegatorIndex].call('get_pool_member_info', []);

    // {
    //   reward_address: 1254925468566415475020808191746114863081461075213051000422250263239065616617n,
    //   amount: 9011093044960616394675n,
    //   index: 434247658687096083680169510n,
    //   unclaimed_rewards: 61882242543753629n,
    //   commission: 0n,
    //   unpool_amount: 261000000000000000000000n,
    //   unpool_time: CairoOption { Some: 1741093793n, None: undefined }
    // }
    const unPoolTimeOption: CairoOption<bigint> = result.unpool_time;
    return {
      delegator: this.delegators[delegatorIndex],
      rewardAddress: result.reward_address.toString(),
      amount: Web3Number.fromWei(result.amount.toString(), getLSTDecimals()),
      index: result.index.toString(),
      unclaimedRewards: Web3Number.fromWei(result.unclaimed_rewards.toString(), getLSTDecimals()),
      unPoolAmount: Web3Number.fromWei(result.unpool_amount.toString(), getLSTDecimals()),
      unPoolTime: unPoolTimeOption.isSome() ? new Date(Number(unPoolTimeOption.Some.toString()) * 1000) : null,
    }
  }

  async getTotalUnclaimedRewards() {
    const proms = this.delegators.map((del, index) => {
      return this.getPoolMemberInfo(index);
    })
    const result = (await Promise.all(proms))

    return result.reduce((acc, info) => acc + Number(info.unclaimedRewards.toString()), 0);
  }


  async getUnstakeAmounts() {
    const proms = this.delegators.map((del, index) => {
      return this.getPoolMemberInfo(index);
    })
    const result = (await Promise.all(proms))
      .filter((info) => info.unPoolAmount.gt(Web3Number.fromWei("0", getLSTDecimals())));
    this.logger.debug("Unstake amounts", result.map((info) => ({
      delegator: info.delegator.address,
      unPoolAmount: info.unPoolAmount.toString(),
      unPoolTime: info.unPoolTime
    })));
    return result;
  }


  async unstakeAction() {
    console.log("Unstake action");
  }
}