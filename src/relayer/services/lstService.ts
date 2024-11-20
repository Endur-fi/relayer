import { Contract } from "npm:starknet";
import { ABI as LSTAbi } from "../../../abis/LST.ts";
import { ABI as StrkAbi } from "../../../abis/Strk.ts";
import { getAddresses } from "../../common/constants.ts";
import { PrismaService } from "./prismaService.ts";
import { ConfigService } from "./configService.ts";
import { assert } from "@std/assert";
import { Injectable } from "@nestjs/common";
interface ILSTService {
  sendToWithdrawQueue(amount: bigint): void;
  stake(delegator: string, amount: bigint): void;
  runDailyJob(): void;
}

@Injectable()
export class LSTService implements ILSTService {
  readonly prismaService: PrismaService;
  readonly Strk;
  readonly LST;

  constructor(
    config: ConfigService,
    prismaService: PrismaService,
  ) {
    this.LST = new Contract(LSTAbi, getAddresses().LST, config.get("account"))
      .typedv2(LSTAbi);

    this.Strk = new Contract(
      StrkAbi,
      getAddresses().Strk,
      config.get("account"),
    ).typedv2(StrkAbi);

    this.prismaService = prismaService;
  }

  async sendToWithdrawQueue(amount: bigint) {
    try {
      const lstBalance = await this.Strk.balance_of(this.LST.address);
      console.log("Lst Balance is", lstBalance);

      assert(
        BigInt(lstBalance.toString()) >= amount,
        "Not enough balance to send to Withdrawqueue",
      );
      this.LST.send_to_withdraw_queue(amount);
    } catch (error) {
      console.error("Failed to send to withdraw queue:", error);
      throw error;
    }
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
          lastStake.timestamp < current_time - 20 * 3600,
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
      this.stake(getAddresses().Delgator[0], netFlow);
    } else {
      console.log("No net flow to stake");
    }
  }
}
