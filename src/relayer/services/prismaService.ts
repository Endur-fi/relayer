import { prisma, PrismaClient } from "../../../prisma/client.ts";

interface IPrismaService {
  getDepositsLastDay(): Promise<bigint>;
  getWithdrawalsLastDay(): Promise<bigint>;
  getNetFlowLastDay(): Promise<bigint>;
}

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

  async getNetFlowLastDay(): Promise<bigint> {
    const deposits = await this.getDepositsLastDay();
    const withdrawals = await this.getWithdrawalsLastDay();
    return deposits - withdrawals;
  }
}
