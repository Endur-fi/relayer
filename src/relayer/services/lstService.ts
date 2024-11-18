import { Contract } from "npm:starknet";
import { ABI as LSTAbi } from "../../../abis/LST.ts";
import { NetworkConfig } from "../../common/types.ts";
import { getAddresses } from "../../common/constants.ts";
import { PrismaService } from "./prismaService.ts";

interface ILST {
  sendToWithdrawQueue(amount: bigint): void;
  stake(delegator: string, amount: bigint): void;
  runDailyJob(): void;
}

export class LST implements ILST {
  readonly networkConfig: NetworkConfig;
  readonly prismaService: PrismaService;
  readonly LST;

  constructor(networkConfig: NetworkConfig, prismaService: PrismaService) {
    this.networkConfig = networkConfig;
    this.LST = new Contract(LSTAbi, getAddresses().LST, networkConfig.account)
      .typedv2(LSTAbi);
    this.prismaService = prismaService;
  }

  sendToWithdrawQueue() {
    // this.LST.send_to_withdraw_queue(amount);
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
