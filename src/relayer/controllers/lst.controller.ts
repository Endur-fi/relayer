import { Body, Controller, Post } from "@nestjs/common";
import { LSTService } from "../services/lstService";

@Controller("lst")
export class LstController {
  constructor(private lst: LSTService) { }

  // TODO : Should this be a Put/Post
  // These apis must be protected under vpn/using `.pem` files of ec2
  @Post("send-wq")
  async sendToWithdrawQueue(@Body("amount") amount: bigint) {
    try {
      console.log("Recieved a request");
      await this.lst.sendToWithdrawQueue(amount);
      console.log("Successfully completed the request");
      return { success: true };
    } catch (error) {
      console.error("Request failed:", error);
      return error;
    }
  }

  @Post("stake")
  async stake(
    @Body("delegator") delegator: string,
    @Body("amount") amount: bigint,
  ) {
    console.log("Received a stake request");
    try {
      console.log(delegator, amount);
      await this.lst.stake(delegator, amount);
      console.log("Successfully completed the stake request");
      return { success: true };
    } catch (error) {
      console.error("Stake request failed:", error);
      return error;
    }
  }
}
