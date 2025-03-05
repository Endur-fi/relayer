import { Call, Contract, TransactionExecutionStatus, uint256 } from "starknet";
import { ABI as LSTAbi } from "../../../abis/LST";
import { ABI as StrkAbi } from "../../../abis/Strk";
import { ABI as DelgatorAbi } from "../../../abis/Delegator";
import { getAddresses } from "../../common/constants";
import { PrismaService } from "./prismaService";
import { ConfigService } from "./configService";
import { Injectable, Logger } from "@nestjs/common";
import { getNetwork } from "../../common/utils";
import { Web3Number } from "@strkfarm/sdk";

import assert = require("assert");
interface ILSTService {
  sendToWithdrawQueue(amount: Web3Number): void;
  stake(delegator: string, amount: bigint): void;
  getSTRKBalance(): Promise<Web3Number>;
  bulkStake(): void;
  exchangeRate(): Promise<number>;
}

@Injectable()
export class LSTService implements ILSTService {
  private readonly logger = new Logger(LSTService.name);
  readonly prismaService: PrismaService;
  readonly config: ConfigService;
  readonly Strk: Contract;
  readonly LST: Contract;

  constructor(
    config: ConfigService,
    prismaService: PrismaService,
  ) {
    this.config = config;
    this.LST = new Contract(LSTAbi, getAddresses(getNetwork()).LST, config.get("account"))
      .typedv2(LSTAbi);

    this.Strk = new Contract(
      StrkAbi,
      getAddresses(getNetwork()).Strk,
      config.get("account"),
    ).typedv2(StrkAbi);

    this.prismaService = prismaService;
  }

  async sendToWithdrawQueue(amount: Web3Number) {
    try {
      const lstBalance = await this.getSTRKBalance();

      assert(
        lstBalance.gte(amount),
        "Not enough balance to send to Withdrawqueue",
      );
      const tx = await this.LST.send_to_withdraw_queue(uint256.bnToUint256(amount.toWei()));
      this.logger.log(`Send to WQ tx: `, tx);
      await this.config.provider().waitForTransaction(tx.transaction_hash);
      this.logger.log(`Send to WQ tx confirmed`);
    } catch (error) {
      console.error("Failed to send to withdraw queue:", error);
      throw error;
    }
  }

  async getSTRKBalance() {
    const amount = await this.Strk.balanceOf(getAddresses(getNetwork()).LST);
    return Web3Number.fromWei(amount.toString(), 18);
  }

  async exchangeRate() {
    let totalAssetsRes = await this.LST.call('total_assets', []);
    let totalSupplyRes = await this.LST.call('total_supply', []);
    const totalAssets = Web3Number.fromWei(totalAssetsRes.toString(), 18);
    const totalSupply = Web3Number.fromWei(totalSupplyRes.toString(), 18);
    return Number(totalAssets.toString()) / Number(totalSupply.toString());
  }

  async stake(delegator: string, amount: bigint) {
    try {
      const lastStake = await this.prismaService.prisma.dispatch_to_stake
        .findFirst();
      console.log("FirstStaking", lastStake);
      if (lastStake) {
        const current_time = Math.floor(Date.now() / 1000);
        // At least 20 hours have passed
        assert(
          Number(lastStake.timestamp) < current_time - 20 * 3600,
          "20 hours not passed",
        );
      }

      console.log("delegator", delegator, "amount", amount);
      this.LST.stake(delegator, amount);
    } catch (error) {
      console.error("Staking failed:", error);
      throw error;
    }
  }

  async bulkStake() {
    const fromIndex = 0;
    const toIndex = getAddresses(getNetwork()).Delgator.length;
    this.logger.log(`Bulk staking from ${fromIndex} to ${toIndex}`);
    // get total stake
    const totalStakeRes = await this.LST.call('total_assets', []);
    const totalStake = Web3Number.fromWei(totalStakeRes.toString(), 18);
    console.log('Total stake: ', totalStake.toString());

    const MIN_BALANCE = 30000;
    const balanceWeb3 = await this.getSTRKBalance();
    this.logger.log("Balance: ", balanceWeb3.toString());
    if (balanceWeb3.lt(MIN_BALANCE)) {
      this.logger.log("Not enough balance to stake");
      return;
    }

    let totalAmount = Math.round(Number(balanceWeb3.toString()) - MIN_BALANCE);
    this.logger.log("Total amount: ", totalAmount);

    // ! TODO: add more items here to make it 25 size
    const distributions = [0.05, 0.05, 0.08, 0.20, 0.61, 1.48, 2.90, 5.24, 8.07, 11.05,
      13.38, 14.16, 13.37, 11.04, 7.90, 4.98, 2.79, 1.49, 0.58, 0.25,
      0.08, 0.05, 0.05, 0.05, 0.05]
    if (toIndex !== distributions.length) {
      throw new Error('Delegator count and distribution count mismatch');
    }

    // compute missing amounts
    // When we unstake from a delegator, we should prioritize this delegator
    // with higher stake amount to bring them back to ideal distribution
    const delegatorCls = await this.config.provider().getClassAt(getAddresses(getNetwork()).Delgator[0]);
    const delegatorStakes = await Promise.all(
      getAddresses(getNetwork()).Delgator.map(async (delegator) => {
        let contract = new Contract(delegatorCls.abi, delegator, this.config.provider());
        const poolConfigRes: any = await contract.call('get_pool_member_info', []);
        return Web3Number.fromWei(poolConfigRes.amount.toString(), 18);
      })
    );

    // the ideal distribution is totalStake * respective distribution %
    // leaving an error of about 5%, we should bring the stake back to this ideal distribution
    const idealDistributions = distributions.map(d => Math.round(Number(totalStake.toString()) * d / 100));
    console.log('Ideal distributions: ', idealDistributions);

    // compute missing amounts
    const missingAmounts = delegatorStakes.map((stake, i) => {
      return idealDistributions[i] - Number(stake.toString());
    });
    console.log('Missing amounts: ', missingAmounts);

    // compute the final distribution amounts for each delegator by using the 
    // totalAmount to stake where missing, if nothing missing, use the remaining 
    // amount to distribute as per the distribution percentages
    // - Max available amount of now is totalAmount
    // - If we have missing amounts > totalAmount, we should distribute the totalAmount
    // - If totalAmount < missingAmounts, we should distribute remaing amount as per the distribution percentages

    // using above logic, compute distributionAmount for each delegator
    let remainingAmount = totalAmount;
    let distributionAmounts = getAddresses(getNetwork()).Delgator.map((delegator, i) => {
      let missingAmount = missingAmounts[i];
      console.log('Missing amount: ', missingAmount, i, remainingAmount);
      if (missingAmount <= 0) {
        return 0;
      }
      if (missingAmount <= remainingAmount) {
        const amt = Math.min(missingAmount, remainingAmount);
        remainingAmount -= amt;
        return amt;
      } else {
        const temp = remainingAmount;
        remainingAmount = 0;
        return temp;
      }
    });
    console.log('Distribution amounts [1]: ', distributionAmounts);
    console.log('Remaining amount: ', remainingAmount);

    // if we still have remaining amount, distribute it as per the distribution percentages
    if (remainingAmount > 0) {
      const _distributionAmounts = distributions.map(d => Math.round(remainingAmount * d / 100));
      // add these distributions to the existing distribution amounts
      distributionAmounts = distributionAmounts.map((amount, i) => {
        return Math.max(amount + _distributionAmounts[i], 0);
      });
    }
    const sumDistribution = distributionAmounts.reduce((a, b) => a + b, 0);
    this.logger.debug('Distribution amounts: ', distributionAmounts);
    this.logger.debug('Sum of distribution amounts: ', sumDistribution);
    const calls: Call[] = [];
    for (let i = fromIndex; i < toIndex; i++) {
      const delegator = getAddresses(getNetwork()).Delgator[i];
      if (distributionAmounts[i] === 0) {
        this.logger.log('Skipping 0 amount distribution');
        continue;
      }
      const call = this.LST.populate('stake', {
        delegator: delegator,
        amount: uint256.bnToUint256(new Web3Number(distributionAmounts[i].toString(), 18).toWei())
      })
      calls.push(call);
    }

    const acc = this.config.get("account");
    const GROUP = 3;
    this.logger.log(`total calls: ${calls.length}`);
    for (let i = 0; i < calls.length; i += GROUP) {
      const tx = await acc.execute(calls.slice(i, i + GROUP));
      this.logger.log('Bulk stake tx: ', tx.transaction_hash);
      await this.config.provider().waitForTransaction(tx.transaction_hash, {
        successStates: [TransactionExecutionStatus.SUCCEEDED]
      })
      this.logger.log(`Bulk staking done: ${i} - ${i + GROUP}`);
    }
    this.logger.log('Bulk staking done');

    return totalAmount;
  }


  async checkRequestStatus(delegator: string): Promise<any> {
    const poolAddress = '0x07d695337550e96e1372dd03274965cca0284ded266efc1774d001d37fbca104';
    const provider = this.config.provider();
    const cls = await provider.getClassAt(poolAddress);
    const poolContract = new Contract(cls.abi, poolAddress, this.config.get("account"));

    const info: any = await poolContract.call('get_pool_member_info', [delegator]);

    // Example
    // CairoOption {
    //   Some: {
    //     reward_address: 299044039529986210136459315899199045490154491370667067552848781420345506232n,
    //     amount: 20000000000000000n,
    //     index: 433515238500389985786131346n,
    //     unclaimed_rewards: 246620359786896n,
    //     commission: 0n,
    //     unpool_amount: 0n,
    //     unpool_time: CairoOption { Some: undefined, None: true }
    //   },
    //   None: undefined
    // }
    //

    return info;
  }

  async UnstakeAction(): Promise<{ address: string, isUnstaking: boolean, unstakingAmount: BigInt }[]> {
    const fromIndex = 0;
    const toIndex = getAddresses(getNetwork()).Delgator.length;
    this.logger.log(`Bulk staking from ${fromIndex} to ${toIndex}`);

    // we will not do bulk unstake action, we will do it one by one
    // This is due to the fact that that if one call fails, 
    // either due to no active request/not yet matured, the entire bulk call will fail

    const delegatorInfos: any = [];

    const acc = this.config.get("account");
    for (let i = fromIndex; i < toIndex; i++) {
      const delegatorAddress = getAddresses(getNetwork()).Delgator[i];
      const delegator = new Contract(DelgatorAbi, delegatorAddress, acc);

      try {
        // Call `unstake_action`
        const unstakeActionCall = delegator.populate('unstake_action', []);
        const tx = await acc.execute([unstakeActionCall]);
        await this.config.provider().waitForTransaction(tx.transaction_hash, {
          successStates: [TransactionExecutionStatus.SUCCEEDED]
        })
        this.logger.log(`Unstake action done for delegator: ${delegatorAddress}`);
      } catch (error) {
        this.logger.error(`Failed to unstake for delegator: ${delegatorAddress}`, error);
      }

      const info = await this.checkRequestStatus(delegatorAddress);

      let isUnstaking = true;
      let unstakingAmount = 0n;
      if (info.Some.unpool_time.Some == undefined) {
        console.log('Request is completed');
        isUnstaking = false;
        unstakingAmount = info.Some.unpool_amount;
      }


      delegatorInfos.push({
        address: delegatorAddress,
        isUnstaking,
        unstakingAmount: unstakingAmount
      });
    }
    return delegatorInfos;
  }
}
