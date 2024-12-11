import { Contract, uint256 } from "starknet";
import { ABI as LSTAbi } from "../../../abis/LST";
import { ABI as StrkAbi } from "../../../abis/Strk";
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

    const MIN_BALANCE = 30000;
    const balanceWeb3 = await this.getSTRKBalance();
    this.logger.log("Balance: ", balanceWeb3.toString());
    if (balanceWeb3.lt(MIN_BALANCE)) {
      this.logger.log("Not enough balance to stake");
      return;
    }

    const totalAmount = Math.round(Number(balanceWeb3.toString()) - MIN_BALANCE);
    this.logger.log("Total amount: ", totalAmount);
    
    // ! TODO: add more items here to make it 25 size
    const distributions = [0.05, 0.05, 0.08, 0.20, 0.61, 1.48, 2.90, 5.24, 8.07, 11.05, 
        13.38, 14.16, 13.37, 11.04, 7.90, 4.98, 2.79, 1.49, 0.58, 0.25, 
        0.08, 0.05, 0.05, 0.05, 0.05, 0.05]
    if (toIndex !== distributions.length) {
        throw new Error('Delegator count and distribution count mismatch');
    }
    
    const distributionAmounts = distributions.map(d => totalAmount * d / 100);
    const sumDistribution = distributionAmounts.reduce((a, b) => a + b, 0);
    this.logger.debug('Sum of distribution amounts: ', sumDistribution);
    this.logger.debug('Distribution amounts: ', distributionAmounts);
    const calls: Call[] = [];
    for (let i = fromIndex; i < toIndex; i++) {
      calls.push(...await stake(i, distributionAmounts[i].toString(), true));
    }

    const GROUP = 3;
    for (let i = 0; i < calls.length; i += GROUP) {
        const tx = await acc.execute(calls.slice(i, i + GROUP));
        this.logger.log('Bulk stake tx: ', tx.transaction_hash);
        await getRpcProvider().waitForTransaction(tx.transaction_hash, {
            successStates: [TransactionExecutionStatus.SUCCEEDED]
        })
        this.logger.log(`Bulk staking done: ${i} - ${i + GROUP}`);
    }
    this.logger.log('Bulk staking done');
  }
}
