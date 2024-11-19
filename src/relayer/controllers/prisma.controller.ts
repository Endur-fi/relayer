import { Controller, Get, Query } from "@nestjs/common";
import { PrismaService } from "../services/prismaService.ts";

@Controller("/data")
export class PrismaController {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Get("/get-deposits-last-day")
  getDepositsLastDay() {
    return this.prisma.getDepositsLastDay();
  }

  @Get("/get-withdrawals-last-day")
  getWithdrawalsLastDay() {
    return this.prisma.getWithdrawalsLastDay();
  }

  @Get("/get-net-flow-last-day")
  getNetFlowLastDay() {
    return this.prisma.getNetFlowLastDay();
  }

  @Get("/get-deposits")
  getDeposits(@Query("from") from: number, @Query("to") to: number) {
    return this.prisma.getDeposits(from, to);
  }

  @Get("/get-withdraws")
  getWithdraws(@Query("from") from: number, @Query("to") to: number) {
    return this.prisma.getWithdraws(from, to);
  }

  @Get("/get-total-deposits")
  getTotalDeposits(@Query("from") from: number, @Query("to") to: number) {
    return this.prisma.getTotalDeposits(from, to);
  }

  @Get("/get-total-withdraws")
  getTotalWithdraws(@Query("from") from: number, @Query("to") to: number) {
    return this.prisma.getTotalWithdraws(from, to);
  }

  @Get("/get-net-flow")
  async getTotalFlow(@Query("from") from: number, @Query("to") to: number) {
    const deposits = await this.prisma.getTotalDeposits(from, to);
    const withdraws = await this.prisma.getTotalWithdraws(from, to);
    const netFlow = BigInt(deposits) - BigInt(withdraws);
    return netFlow;
  }
}
