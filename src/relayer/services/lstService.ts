import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Web3Number } from "@strkfarm/sdk";
import { Call, Contract, TransactionExecutionStatus, uint256 } from "starknet";

import { ConfigService } from "./configService";
import { PrismaService } from "./prismaService";
import { ABI as LSTAbi } from "../../../abis/LST";
import { ABI as StrkAbi } from "../../../abis/Strk";
import { getAddresses } from "../../common/constants";
import { getNetwork } from "../../common/utils";

const assert = require("assert");

interface ILSTService {
  sendToWithdrawQueue(amount: Web3Number): void;
  stake(delegator: string, amount: bigint): void;
  getSTRKBalance(): Promise<Web3Number>;
  unclaimedRewards(): Promise<Web3Number>;
  claimRewards(): void;
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
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => PrismaService))
    prismaService: PrismaService
  ) {
    console.log("LSTService initialized with config:", config);
    this.config = config;
    this.LST = new Contract(
      LSTAbi,
      getAddresses(getNetwork()).LST,
      config.get("account")
    ).typedv2(LSTAbi);

    this.Strk = new Contract(
      StrkAbi,
      getAddresses(getNetwork()).Strk,
      config.get("account")
    ).typedv2(StrkAbi);

    this.prismaService = prismaService;
  }

  async sendToWithdrawQueue(amount: Web3Number) {
    try {
      const lstBalance = await this.getSTRKBalance();

      assert(
        lstBalance.gte(amount),
        "Not enough balance to send to Withdrawqueue"
      );
      const tx = await this.LST.send_to_withdraw_queue(
        uint256.bnToUint256(amount.toWei())
      );
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
    const totalAssetsRes = await this.LST.call("total_assets", []);
    const totalSupplyRes = await this.LST.call("total_supply", []);
    const totalAssets = Web3Number.fromWei(totalAssetsRes.toString(), 18);
    const totalSupply = Web3Number.fromWei(totalSupplyRes.toString(), 18);
    return Number(totalAssets.toString()) / Number(totalSupply.toString());
  }

  async stake(delegator: string, amount: bigint) {
    try {
      const lastStake =
        await this.prismaService.prisma.dispatch_to_stake.findFirst();
      console.log("FirstStaking", lastStake);
      if (lastStake) {
        const current_time = Math.floor(Date.now() / 1000);
        // At least 20 hours have passed
        assert(
          Number(lastStake.timestamp) < current_time - 20 * 3600,
          "20 hours not passed"
        );
      }

      console.log("delegator", delegator, "amount", amount);
      this.LST.stake(delegator, amount);
    } catch (error) {
      console.error("Staking failed:", error);
      throw error;
    }
  }

  async unclaimedRewards() {
    const res = await this.LST.call("unclaimed_rewards", []);
    return Web3Number.fromWei(res.toString(), 18);
  }

  async claimRewards() {
    const acc = this.config.get("account");
    const tx = await acc.execute([this.LST.populate("claim_rewards", [])]);
    this.logger.log("Claim rewards tx: ", tx.transaction_hash);
    await this.config.provider().waitForTransaction(tx.transaction_hash, {
      successStates: [TransactionExecutionStatus.SUCCEEDED],
    });
    this.logger.log("Claim rewards done");
  }

  async bulkStake() {
    const fromIndex = 0;
    const toIndex = getAddresses(getNetwork()).Delgator.length;
    this.logger.log(`Bulk staking from ${fromIndex} to ${toIndex}`);
    // get total stake
    const totalStakeRes = await this.LST.call("total_assets", []);
    const totalStake = Web3Number.fromWei(totalStakeRes.toString(), 18);
    console.log("Total stake: ", totalStake.toString());

    const MIN_BALANCE = 30000;
    const balanceWeb3 = await this.getSTRKBalance();
    this.logger.log("Balance: ", balanceWeb3.toString());
    if (balanceWeb3.lt(MIN_BALANCE)) {
      this.logger.log("Not enough balance to stake");
      return;
    }

    const totalAmount = Math.round(
      Number(balanceWeb3.toString()) - MIN_BALANCE
    );
    this.logger.log("Total amount: ", totalAmount);

    // ! TODO: add more items here to make it 25 size
    const distributions = [
      0.05, 0.05, 0.08, 0.2, 0.61, 1.48, 2.9, 5.24, 8.07, 11.05, 13.38, 14.16,
      13.37, 11.04, 7.9, 4.98, 2.79, 1.49, 0.58, 0.25, 0.08, 0.05, 0.05, 0.05,
      0.05,
    ];
    if (toIndex !== distributions.length) {
      throw new Error("Delegator count and distribution count mismatch");
    }

    // compute missing amounts
    // When we unstake from a delegator, we should prioritize this delegator
    // with higher stake amount to bring them back to ideal distribution
    const delegatorCls = await this.config
      .provider()
      .getClassAt(getAddresses(getNetwork()).Delgator[0]);
    const delegatorStakes = await Promise.all(
      getAddresses(getNetwork()).Delgator.map(async (delegator) => {
        const contract = new Contract(
          delegatorCls.abi,
          delegator,
          this.config.provider()
        );
        const poolConfigRes: any = await contract.call(
          "get_pool_member_info",
          []
        );
        return Web3Number.fromWei(poolConfigRes.amount.toString(), 18);
      })
    );

    // the ideal distribution is totalStake * respective distribution %
    // leaving an error of about 5%, we should bring the stake back to this ideal distribution
    const idealDistributions = distributions.map((d) =>
      Math.round((Number(totalStake.toString()) * d) / 100)
    );
    console.log("Ideal distributions: ", idealDistributions);

    // compute missing amounts
    const missingAmounts = delegatorStakes.map((stake, i) => {
      return idealDistributions[i] - Number(stake.toString());
    });
    console.log("Missing amounts: ", missingAmounts);

    // compute the final distribution amounts for each delegator by using the
    // totalAmount to stake where missing, if nothing missing, use the remaining
    // amount to distribute as per the distribution percentages
    // - Max available amount of now is totalAmount
    // - If we have missing amounts > totalAmount, we should distribute the totalAmount
    // - If totalAmount < missingAmounts, we should distribute remaing amount as per the distribution percentages

    // using above logic, compute distributionAmount for each delegator
    let remainingAmount = totalAmount;
    let distributionAmounts = getAddresses(getNetwork()).Delgator.map(
      (delegator, i) => {
        const missingAmount = missingAmounts[i];
        console.log("Missing amount: ", missingAmount, i, remainingAmount);
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
      }
    );
    console.log("Distribution amounts [1]: ", distributionAmounts);
    console.log("Remaining amount: ", remainingAmount);

    // if we still have remaining amount, distribute it as per the distribution percentages
    if (remainingAmount > 0) {
      const _distributionAmounts = distributions.map((d) =>
        Math.round((remainingAmount * d) / 100)
      );
      // add these distributions to the existing distribution amounts
      distributionAmounts = distributionAmounts.map((amount, i) => {
        return Math.max(amount + _distributionAmounts[i], 0);
      });
    }
    const sumDistribution = distributionAmounts.reduce((a, b) => a + b, 0);
    this.logger.debug("Distribution amounts: ", distributionAmounts);
    this.logger.debug("Sum of distribution amounts: ", sumDistribution);
    const calls: Call[] = [];
    for (let i = fromIndex; i < toIndex; i++) {
      const delegator = getAddresses(getNetwork()).Delgator[i];
      if (distributionAmounts[i] === 0) {
        this.logger.log("Skipping 0 amount distribution");
        continue;
      }
      const call = this.LST.populate("stake", {
        delegator: delegator,
        amount: uint256.bnToUint256(
          new Web3Number(distributionAmounts[i].toString(), 18).toWei()
        ),
      });
      calls.push(call);
    }

    const acc = this.config.get("account");
    const GROUP = 3;
    this.logger.log(`total calls: ${calls.length}`);
    for (let i = 0; i < calls.length; i += GROUP) {
      const tx = await acc.execute(calls.slice(i, i + GROUP));
      this.logger.log("Bulk stake tx: ", tx.transaction_hash);
      await this.config.provider().waitForTransaction(tx.transaction_hash, {
        successStates: [TransactionExecutionStatus.SUCCEEDED],
      });
      this.logger.log(`Bulk staking done: ${i} - ${i + GROUP}`);
    }
    this.logger.log("Bulk staking done");

    return totalAmount;
  }
}
