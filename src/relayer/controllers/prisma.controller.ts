import { Controller, Get, Query } from "@nestjs/common";
import { PrismaService } from "../services/prismaService.ts";

@Controller("/data")
export class PrismaController {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Get("/get-deposits-last-day")
  async getDepositsLastDay() {
    try {
      return await this.prisma.getDepositsLastDay();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("/get-withdrawals-last-day")
  async getWithdrawalsLastDay() {
    try {
      return await this.prisma.getWithdrawalsLastDay();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("/get-net-flow-last-day")
  async getNetFlowLastDay() {
    try {
      return await this.prisma.getNetFlowLastDay();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("/get-deposits")
  async getDeposits(@Query("from") from: number, @Query("to") to: number) {
    try {
      return await this.prisma.getDeposits(from, to);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("/get-withdraws")
  async getWithdraws(@Query("from") from: number, @Query("to") to: number) {
    try {
      return await this.prisma.getWithdraws(from, to);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("/get-total-deposits")
  async getTotalDeposits(@Query("from") from: number, @Query("to") to: number) {
    try {
      return await this.prisma.getTotalDeposits(from, to);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("/get-total-withdraws")
  async getTotalWithdraws(@Query("from") from: number, @Query("to") to: number) {
    try {
      return await this.prisma.getTotalWithdraws(from, to);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get("/get-net-flow")
  async getTotalFlow(@Query("from") from: number, @Query("to") to: number) {
    try {
      const deposits = await this.prisma.getTotalDeposits(from, to);
      const withdraws = await this.prisma.getTotalWithdraws(from, to);
      const netFlow = BigInt(deposits) - BigInt(withdraws);
      return netFlow;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
