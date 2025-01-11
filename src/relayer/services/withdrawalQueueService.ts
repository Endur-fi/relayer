import { Contract, Call } from "starknet";
import { PrismaService } from "./prismaService";
import { ConfigService } from "./configService";
import { getAddresses } from "../../common/constants";
import { ABI as WQAbi } from "../../../abis/WithdrawalQueue";
import { ABI as StrkAbi } from "../../../abis/Strk";
import { Injectable, Logger } from "@nestjs/common";
import { Web3Number } from "@strkfarm/sdk";
import { getNetwork } from "../../common/utils";

interface IWithdrawalQueueState {
  max_request_id: number;
  unprocessed_withdraw_queue_amount: Web3Number;
  intransit_amount: Web3Number;
}

interface IWithdrawalQueueService {
  claimWithdrawal(request_id: number): void;
  getClaimWithdrawalCall(request_id: number): Call;
  claimWithdrawalInRange(from: number, to: number): void;
  getSTRKBalance(): Promise<Web3Number>;
  getWithdrawalQueueState(): Promise<IWithdrawalQueueState>;
}

@Injectable()
export class WithdrawalQueueService implements IWithdrawalQueueService {
  private readonly logger = new Logger(WithdrawalQueueService.name);
  readonly prismaService: PrismaService;
  readonly Strk;
  readonly WQ;

  constructor(
    config: ConfigService,
    prismaService: PrismaService,
  ) {
    this.WQ = new Contract(
      WQAbi,
      getAddresses(getNetwork()).WithdrawQueue,
      config.get("account"),
    )
      .typedv2(WQAbi);

    this.Strk = new Contract(
      StrkAbi,
      getAddresses(getNetwork()).Strk,
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

  getClaimWithdrawalCall(request_id: number | bigint): Call {
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

  async getSTRKBalance() {
    const amount = await this.Strk.balanceOf(getAddresses(getNetwork()).WithdrawQueue);
    return Web3Number.fromWei(amount.toString(), 18);
  }

  async getWithdrawalQueueState() {
    const res = await this.WQ.get_queue_state();
    console.log("WithdrawalQueueState", res);
    return {
      max_request_id: Number(res.max_request_id),
      unprocessed_withdraw_queue_amount: Web3Number.fromWei(res.unprocessed_withdraw_queue_amount.toString(), 18),
      intransit_amount: Web3Number.fromWei(res.intransit_amount.toString(), 18),
      cumulative_requested_amount: Web3Number.fromWei(res.cumulative_requested_amount.toString(), 18),
    }
  }
}
