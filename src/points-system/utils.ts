import { PrismaClient, user_balances } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { logger } from "@strkfarm/sdk";
import axios from "axios";
import { EndurSDK } from "@endur/sdk";
import { getProvider } from "../common/utils";

export const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

const blockCache: Record<string, { block_number: number }> = {};
export async function findClosestBlockInfo(date: Date) {
  const timestamp = Math.floor(date.getTime() / 1000);
  const timeWindow = 0.5 * 3600 * 48; // 30min
  const cacheKey = timestamp.toString();
  if (blockCache[cacheKey]) {
    return blockCache[cacheKey];
  }
  // generate a random timestamp within the day
  const randomTimestampOfTheDay = Math.floor(Math.random() * 86400 + timestamp);
  const res = await prisma.blocks.findFirst({
    where: {
      timestamp: {
        // lte: Math.min(randomTimestampOfTheDay + timeWindow, timestamp + 86400), // within next day
        // gte: randomTimestampOfTheDay,
        gte: timestamp,
        lte: timestamp + timeWindow,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  if (res) {
    blockCache[cacheKey] = { block_number: Number(res.block_number) };
  }
  return res ? { block_number: Number(res.block_number) } : null;
}

const endurSdk = new EndurSDK({
  config: {
    network: 'mainnet',
    timeout: 30000,
  },
  provider: getProvider() as any
});

export async function fetchHoldingsFromApi(
  userAddr: string,
  blockNumber: number,
  date: Date
): Promise<{
  xSTRKHoldings: user_balances;
  strkHoldings: {
    strkfarmEkuboAmount: string;
    nostraDexAmount: string;
    ekuboAmount: string;
  };
}> {
  
  const data = await endurSdk.holdings.getMultiProtocolHoldings({
    address: userAddr,
    blockNumber: blockNumber,
    provider: getProvider() as any
  });

  const timestamp = Math.floor(date.getTime() / 1000);
  const dbObject: user_balances = {
    user_address: userAddr,
    block_number: blockNumber,
    vesuAmount: (BigInt(data.byProtocol.vesu.xSTRKAmount) / BigInt(10**18)).toString(),
    ekuboAmount: (BigInt(data.byProtocol.ekubo.xSTRKAmount) / BigInt(10**18)).toString(),
    nostraLendingAmount: (BigInt(data.byProtocol.nostraLending.xSTRKAmount) / BigInt(10**18)).toString(),
    nostraDexAmount: (BigInt(data.byProtocol.nostraDex.xSTRKAmount) / BigInt(10**18)).toString(),
    walletAmount: (BigInt(data.byProtocol.lst.xSTRKAmount) / BigInt(10**18)).toString(),
    strkfarmAmount: (BigInt(data.byProtocol.strkfarm.xSTRKAmount) + BigInt(data.byProtocol.strkfarmEkubo.xSTRKAmount)).toString(),
    opusAmount: (BigInt(data.byProtocol.opus.xSTRKAmount) / BigInt(10**18)).toString(),
    total_amount: (BigInt(data.total.xSTRKAmount) / BigInt(10**18)).toString(),
    date: date.toISOString().split("T")[0],
    timestamp: timestamp,
  };

  return {
    xSTRKHoldings: dbObject,
    strkHoldings: {
      strkfarmEkuboAmount: (BigInt(data.byProtocol.strkfarmEkubo.STRKAmount) / BigInt(10**18)).toString(),
      nostraDexAmount: (BigInt(data.byProtocol.nostraDex.STRKAmount) / BigInt(10**18)).toString(),
      ekuboAmount: (BigInt(data.byProtocol.ekubo.STRKAmount) / BigInt(10**18)).toString(),
    },
  };
}

export function calculatePoints(
  totalAmount: string,
  multipler: number
): bigint {
  if (!totalAmount || totalAmount == "0") {
    // logger.warn(`Invalid totalAmount: ${totalAmount}`);
    return 0n; // Fix: Use `0n` for `bigint` instead of `BigInt(0)`
  }
  const amount = parseFloat(totalAmount);
  const points = Math.floor(amount * multipler);
  // logger.info(`Calculated points: ${points} for totalAmount: ${totalAmount}`);
  return BigInt(points);
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const bigIntToDecimal = (value: bigint): Decimal =>
  new Decimal(value.toString());

export const getDate = (dateString?: string): Date => {
  const date = dateString ? new Date(dateString) : new Date();
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
