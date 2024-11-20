import { Body, Controller, Post } from "@nestjs/common";
import { WithdrawalQueueService } from "../services/withdrawalQueueService.ts";

@Controller("wq")
export class WqController {
  constructor(private wq: WithdrawalQueueService) {
  }

  @Post("claim-withdrawal")
  claimWithdrawal(@Body("request_id") request_id: number) {
    try {
      console.log("req for claiming");
      this.wq.claimWithdrawal(request_id);
      return { success: true };
    } catch (error) {
      console.error("Failed to claim: ", error);
      return error;
    }
  }

  @Post("claim-withdrawal-range")
  claimWithdrawalInRange(
    @Body("request_id_from") from: number,
    @Body("request_id_to") to: number,
  ) {
    try {
      this.wq.claimWithdrawalInRange(from, to);
      return { success: true };
    } catch (error) {
      console.error("Failed to claim: ", error);
      return error;
    }
  }
}
