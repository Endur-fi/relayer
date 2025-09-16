import { Injectable, Logger } from "@nestjs/common";
import { withdraw_queue } from "@prisma/client";
import { ContractAddr, Global, Web3Number } from "@strkfarm/sdk";

import { deposits, prisma, PrismaClient } from "../../../prisma/client";
import { getLSTInfo, getTokenDecimals, getTokenInfoFromAddr } from "../../common/constants";
import { get64BitAddress } from "../../common/utils";

interface IPrismaService {
  getWithdrawalsLastDay(isRolling: boolean): Promise<bigint>;
  getPendingWithdraws(assetAddress: ContractAddr, minAmount: Web3Number): Promise<[PendingWithdraws[], bigint[]]>;
  markWithdrawalAsNotified(requestId: bigint): Promise<void>;
}

export interface PendingWithdraws {
  amount: string;
  request_id: bigint;
  cumulative_requested_amount_snapshot: string;
  timestamp: number;
  receiver: string;
  is_notified: boolean;
}

@Injectable()
export class PrismaService implements IPrismaService {
  private readonly logger = new Logger(PrismaService.name);
  prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async getWithdrawalsLastDay(isRolling = false): Promise<bigint> {
    const timeNow = Date.now();
    const timeInUnix = isRolling
      ? new Date(timeNow - 86400000).getTime()
      : Math.floor(Math.floor(timeNow / 1000) / 86400) * 86400;

    const withdrawals = await this.prisma.withdraw_queue.findMany({
      where: {
        timestamp: {
          gt: timeInUnix,
        },
      },
    });

    const totalWithdrawals = withdrawals.reduce(
      (sum: bigint, e: withdraw_queue) => {
        return sum + BigInt(e.amount);
      },
      BigInt(0)
    );

    // return BigInt(2);
    return totalWithdrawals;
  }

  async getPendingWithdraws(assetAddress: ContractAddr, minAmount: Web3Number): Promise<
    [PendingWithdraws[], bigint[]]
  > {
    const lstInfo = getLSTInfo(assetAddress);
    const tokenInfo = await getTokenInfoFromAddr(assetAddress);
    const pendingWithdraws = await this.prisma.withdraw_queue.findMany({
      orderBy: {
        request_id: "asc",
      },
      where: {
        is_claimed: false,
        queue_contract: get64BitAddress(lstInfo.WithdrawQueue.address),
      },
      select: {
        request_id: true,
        amount: true,
        cumulative_requested_amount_snapshot: true,
        timestamp: true,
        receiver: true,
        is_notified: true,
      },
    });

    // filter out withdrawals that are less than minAmount
    // also isolate the rejected ones and mark them as rejected
    const rejected_ids: bigint[] = [];
    const filteredWithdraws = await Promise.all(pendingWithdraws.filter(async (withdraw: any) => {
      const amount = Web3Number.fromWei(withdraw.amount, await getTokenDecimals(assetAddress));
      if (amount.lt(minAmount)) {
        rejected_ids.push(withdraw.request_id);
        return false;
      }
      return true;
    }));

    if (rejected_ids.length > 0) {
      this.logger.log(`${tokenInfo.symbol} Rejecting ${rejected_ids.length} withdrawals`);
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

  async markWithdrawalAsNotified(requestId: bigint): Promise<void> {
    await this.prisma.withdraw_queue.updateMany({
      where: {
        request_id: requestId,
      },
      data: {
        is_notified: true,
      },
    });
  }
}
