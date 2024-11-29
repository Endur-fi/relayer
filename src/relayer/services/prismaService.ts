import { deposits, prisma, PrismaClient } from "../../../prisma/client";
import { Injectable, Logger } from "@nestjs/common";
import { Web3Number } from "@strkfarm/sdk";

interface IPrismaService {
  getDepositsLastDay(): Promise<bigint>;
  getWithdrawalsLastDay(): Promise<bigint>;
  getNetFlowLastDay(): Promise<bigint>;
}

@Injectable()
export class PrismaService implements IPrismaService {
  private readonly logger = new Logger(PrismaService.name);
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
        depositsArray[index].cursor = BigInt(depositsArray[index].cursor?.toString() ?? 0);
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
        withdrawsArray[index].cursor = BigInt(withdrawsArray[index].cursor?.toString() ?? 0);
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

  async getPendingWithdraws(minAmount: Web3Number): Promise<[{
    amount_strk: string;
    request_id: bigint;
  }[], bigint[]]> {
    const pendingWithdraws = await this.prisma.withdraw_queue.findMany({
      orderBy: {
        request_id: "asc",
      },
      where: {
        is_claimed: false,
        NOT: {
          request_id: {
            in: await prisma.withdraw_queue.findMany({
              where: { OR: [{
                is_claimed: true 
              }, {
                is_rejected: true
              }] },
              select: { request_id: true },
            }).then(results => results.map(r => r.request_id)),
          },
        },
      },
      select: {
        request_id: true,
        amount_strk: true,
      }
    });

    // filter out withdrawals that are less than minAmount
    // also isolate the rejected ones and mark them as rejected
    let rejected_ids: bigint[] = [];
    const filteredWithdraws = [];
    pendingWithdraws.filter(
      (withdraw: any) => {
        const amount = Web3Number.fromWei(withdraw.amount_strk, 18);
        if (amount.lt(minAmount)) {
          rejected_ids.push(withdraw.request_id);
          return false;
        }
        return true;
      },
    );

    if (rejected_ids.length > 0) {
      this.logger.log(`Rejecting ${rejected_ids.length} withdrawals`);
      await this.prisma.withdraw_queue.updateMany({
        where: {
          request_id: {
            in: rejected_ids,
          },
        },
        data: {
          is_rejected: true,
        },
      });
    }

    return [filteredWithdraws, rejected_ids];
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
