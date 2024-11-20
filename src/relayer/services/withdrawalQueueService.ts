import { Contract } from "npm:starknet";
import { PrismaService } from "./prismaService.ts";
import { ConfigService } from "./configService.ts";
import { getAddresses } from "../../common/constants.ts";
import { ABI as WQAbi } from "../../../abis/WithdrawalQueue.ts";
import { ABI as StrkAbi } from "../../../abis/Strk.ts";
import { Injectable } from "@nestjs/common";

interface IWithdrawalQueueService {
  claimWithdrawal(request_id: number): void;
}

@Injectable()
export class WithdrawalQueueService implements IWithdrawalQueueService {
  readonly prismaService: PrismaService;
  readonly Strk;
  readonly WQ;

  constructor(
    config: ConfigService,
    prismaService: PrismaService,
  ) {
    this.WQ = new Contract(WQAbi, getAddresses().LST, config.get("account"))
      .typedv2(WQAbi);

    this.Strk = new Contract(
      StrkAbi,
      getAddresses().Strk,
      config.get("account"),
    ).typedv2(StrkAbi);

    this.prismaService = prismaService;
  }

  claimWithdrawal(request_id: number) {
    try {
      this.WQ.claim_withdrawal(request_id);
    } catch (error) {
      console.error("Failed to claim withdrawal: ", error);
      throw error;
    }
  }

  claimWithdrawalInRange(from: number, to: number) {
    let i;
    try {
      for (i = from; i <= to; i++) {
        this.claimWithdrawal(i);
      }
    } catch (error) {
      console.error(
        `Failed to claim withdrawal in range for ${i}: `,
        error,
      );
      throw error;
    }
  }
}
