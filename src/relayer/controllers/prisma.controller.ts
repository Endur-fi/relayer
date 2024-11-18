import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../services/prismaService.ts";

@Controller("/data")
export class PrismaController {
  constructor(
    private prisma: PrismaService,
  ) {}

  // @Get()
  // hello() {
  //   return "All services operational";
  // }

  @Get("/get-deposits-last-day")
  getDepositsLastDay() {
    return this.prisma.getDepositsLastDay();
  }

  @Get("/get-withdrawals-last-day")
  getWithdrawalsLastDay() {
    return this.prisma.getWithdrawalsLastDay();
  }
}
