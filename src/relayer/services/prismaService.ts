import { deposits, prisma, PrismaClient } from "../../../prisma/client.ts";
import { Injectable } from "@nestjs/common";

interface IPrismaService {
  getDepositsLastDay(): Promise<bigint>;
  getWithdrawalsLastDay(): Promise<bigint>;
  getNetFlowLastDay(): Promise<bigint>;
}

@Injectable()
export class PrismaService implements IPrismaService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async getDepositsLastDay(): Promise<bigint> {
    const timeNow = Date.now();
    const timeInUnix = Math.floor(Math.floor(timeNow / 1000) / 86400) * 86400;
    const dep = await this.prisma.deposits.findMany({
      where: {
        timestamp: {
          gt: timeInUnix,
        },
      },
    });

    const totalDeposits = dep.reduce((sum: bigint, e: typeof dep[0]) => {
      return sum + BigInt(e.assets);
    }, BigInt(0));

    return totalDeposits;
  }

  async getWithdrawalsLastDay(): Promise<bigint> {
    const timeNow = Date.now();
    const timeInUnix = Math.floor(Math.floor(timeNow / 1000) / 86400) * 86400;

    const withdrawals = await this.prisma.withdraw_queue.findMany({
      where: {
        timestamp: {
          gt: timeInUnix,
        },
      },
    });

    const totalWithdrawals = withdrawals.reduce(
      (sum: bigint, e: typeof withdrawals[0]) => {
        return sum + BigInt(e.amount_strk);
      },
      BigInt(0),
    );

    // return BigInt(2);
    return totalWithdrawals;
  }

  async getDeposits(from: number, to: number) {
    const deposits = await this.prisma.deposits.findMany({
      where: {
        timestamp: {
          gte: Number(from),
          lt: Number(to),
        },
      },
    });

    deposits?.forEach(
      (
        _e: typeof deposits[0],
        index: number,
        depositsArray: typeof deposits,
      ) => {
        depositsArray[index].cursor = depositsArray[index].cursor.toString();
      },
    );
    return deposits;
  }

  async getWithdraws(from: number, to: number) {
    const withdraws = await this.prisma.withdraw_queue.findMany({
      where: {
        timestamp: {
          gte: Number(from),
          lt: Number(to),
        },
      },
    });

    withdraws?.forEach(
      (
        _e: typeof withdraws[0],
        index: number,
        withdrawsArray: typeof withdraws,
      ) => {
        withdrawsArray[index].cursor = withdrawsArray[index].cursor.toString();
      },
    );
    return withdraws;
  }

  async getTotalWithdraws(from: number, to: number) {
    const withdraws = await this.getWithdraws(from, to);
    const totalWithdrawals = withdraws?.reduce(
      (sum: bigint, e: typeof withdraws[0]) => {
        return sum + BigInt(e.amount_kstrk);
      },
      BigInt(0),
    );
    return totalWithdrawals;
  }

  async getTotalDeposits(from: number, to: number) {
    const deposits = await this.getDeposits(from, to);
    const totalDeposits = deposits?.reduce(
      (sum: bigint, e: typeof deposits[0]) => {
        return sum + BigInt(e.assets);
      },
      BigInt(0),
    );

    return totalDeposits;
  }

  async getNetFlowLastDay(): Promise<bigint> {
    const deposits = await this.getDepositsLastDay();
    const withdrawals = await this.getWithdrawalsLastDay();
    return deposits - withdrawals;
  }
}
