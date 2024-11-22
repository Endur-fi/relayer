import { Contract, Call } from "npm:starknet";
import { PrismaService } from "./prismaService.ts";
import { ConfigService } from "./configService.ts";
import { getAddresses } from "../../common/constants.ts";
import { ABI as WQAbi } from "../../../abis/WithdrawalQueue.ts";
import { ABI as StrkAbi } from "../../../abis/Strk.ts";
import { Injectable } from "@nestjs/common";
import { Web3Number } from "@strkfarm/sdk";

interface IWithdrawalQueueState {
  last_fill_id: number;
  max_request_id: number;
  unprocessed_withdraw_queue_amount: Web3Number;
  intransit_amount: Web3Number;
}

interface IWithdrawalQueueService {
  claimWithdrawal(request_id: number): void;
  getClaimWithdrawalCall(request_id: number): Call;
  claimWithdrawalInRange(from: number, to: number): void;
  getSTRKBalance(): Promise<bigint>;
  getWithdrawalQueueState(): Promise<IWithdrawalQueueState>;
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
    this.WQ = new Contract(
      WQAbi,
      getAddresses().WithdrawQueue,
      config.get("account"),
    )
      .typedv2(WQAbi);

    this.Strk = new Contract(
      StrkAbi,
      getAddresses().Strk,
      config.get("account"),
    ).typedv2(StrkAbi);

    this.prismaService = prismaService;
  }

  async claimWithdrawal(request_id: number) {
    try {
      const res = await this.WQ.claim_withdrawal(request_id);
      console.log("Result", res);
    } catch (error) {
      console.error("Failed to claim withdrawal: ", error);
      throw error;
    }
  }

  getClaimWithdrawalCall(request_id: number): Call {
    return this.WQ.populate("claim_withdrawal", [request_id]);
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

  getSTRKBalance() {
    return this.Strk.balanceOf(getAddresses().WithdrawQueue) as Promise<bigint>;
  }

  async getWithdrawalQueueState() {
    const res = await this.WQ.get_queue_state();
    return {
      last_fill_id: Number(res.last_fill_id),
      max_request_id: Number(res.max_request_id),
      unprocessed_withdraw_queue_amount: Web3Number.fromWei(res.unprocessed_withdraw_queue_amount.toString(), 18),
      intransit_amount: Web3Number.fromWei(res.intransit_amount.toString(), 18),
    }
  }
}
