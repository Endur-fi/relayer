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
  runDailyJob(): void;
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

  async runDailyJob() {
    const netFlow = await this.prismaService.getNetFlowLastDay();
    if (netFlow > BigInt(0)) {
      this.stake(getAddresses(getNetwork()).Delgator[0], netFlow);
    } else {
      console.log("No net flow to stake");
    }
  }
}
