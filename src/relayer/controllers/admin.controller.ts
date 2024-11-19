import { Controller, Put } from "@nestjs/common";
import { LSTService } from "../services/lstService.ts";

@Controller("lst")
export class LstController {
  constructor(private lst: LSTService) {}

  // TODO : Should this be a Put/Post/Get
  @Put()
  sendToWithdrawQueue(amount: bigint) {
    this.lst.sendToWithdrawQueue(amount);
  }
}
