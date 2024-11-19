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
    const lstBalance = await this.Strk.balance_of(this.LST.address);

    assert(
      BigInt(lstBalance.toString()) >= amount,
      "Not enough balance to send to Withdrawqueue",
    );
    this.LST.send_to_withdraw_queue(amount);
  }

  stake(delegator: string, amount: bigint) {
    this.LST.stake(delegator, amount);
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
