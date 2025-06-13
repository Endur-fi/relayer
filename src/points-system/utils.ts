import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient, user_balances } from '@prisma/my-client';
import { logger } from '@strkfarm/sdk';
import axios from 'axios';

export const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

const API_BASE_URL = `${process.env.API_ENDPOINT}/api/block-holdings`;

// list of supported dApps to account points for
export const DAPPs = [
  'vesu',
  'ekubo',
  'nostraLending',
  'nostraDex',
  'wallet', // i.e. endur (xSTRK held in wallet directly)
  'strkfarm',
  'opus'
];

type dAppAmountProperty =
  | 'vesuAmount'
  | 'ekuboAmount'
  | 'nostraLendingAmount'
  | 'nostraDexAmount'
  | 'walletAmount'
  | 'strkfarmAmount'
  | 'opusAmount';

const blockCache: Record<string, { block_number: number }> = {};
export async function findClosestBlockInfo(date: Date) {
  const timestamp = Math.floor(date.getTime() / 1000);
  const timeWindow = 0.5 * 3600 * 48; // 30min
  const cacheKey = timestamp.toString();
  if (blockCache[cacheKey]) {
    return blockCache[cacheKey];
  }
  // generate a random timestamp within the day
  const randomTimestampOfTheDay = Math.floor(
    (Math.random() * (86400)) +  (timestamp),
  );
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
      timestamp: 'desc',
    },
  });
  if (res) {
    blockCache[cacheKey] = { block_number: Number(res.block_number) };
  }
  return res ? { block_number: Number(res.block_number) } : null;
}

export async function fetchHoldingsFromApi(
  userAddr: string,
  blockNumber: number,
  date: Date,
): Promise<{
  xSTRKHoldings: user_balances;
  strkHoldings: {
    strkfarmEkuboAmount: string;
    nostraDexAmount: string;
    ekuboAmount: string;
  };
}> {
  const endpoint = Math.random() < 0.5 ? API_BASE_URL : API_BASE_URL;
  const url = `${endpoint}/${userAddr}/${blockNumber}`;
  const response = await axios.get(url);
  const data = response.data;

  if (!data.blocks || !data.blocks[0]) {
    throw new Error(
      `Invalid data format for user ${userAddr} on date: ${date.toISOString().split('T')[0]}`,
    );
  }

  const timestamp = Math.floor(date.getTime() / 1000);
  const dbObject: user_balances = {
    user_address: userAddr,
    block_number: Number(data.blocks[0].block),
    vesuAmount: '0',
    ekuboAmount: '0',
    nostraLendingAmount: '0',
    nostraDexAmount: '0',
    walletAmount: '0',
    strkfarmAmount: '0',
    total_amount: '0',
    opusAmount: '0',
    date: date.toISOString().split('T')[0],
    timestamp: timestamp,
  };

  const strkAmountsObject = {...dbObject};

  let totalAmount = 0;
  for (let dapp of DAPPs) {
    if (!data[dapp] || !data[dapp][0]) {
      throw new Error(
        `Invalid data format for dapp ${dapp} for user ${userAddr} on date: ${date.toISOString().split('T')[0]}`,
      );
    }
    const xSTRKAmount =
      Number(
        Number(data[dapp][0].xSTRKAmount.bigNumber * 100) /
          10 ** data[dapp][0].xSTRKAmount.decimals,
      ) / 100;
    totalAmount += xSTRKAmount;
    const key = `${dapp}Amount` as dAppAmountProperty;
    dbObject[key] = xSTRKAmount.toString();

    const STRKAmount = Number(
      Number(data[dapp][0].STRKAmount.bigNumber * 100) /
        10 ** data[dapp][0].STRKAmount.decimals,
    ) / 100;
    strkAmountsObject[key] = STRKAmount.toString();
  }

  // handle exceptions
  const strkfarmEkuboAmount = Number(
    Number(data["strkfarmEkubo"][0].xSTRKAmount.bigNumber * 100) /
      10 ** data["strkfarmEkubo"][0].xSTRKAmount.decimals,
  ) / 100;
  const strkfarmSTRKAmount = Number(
    Number(data["strkfarmEkubo"][0].STRKAmount.bigNumber * 100) /
      10 ** data["strkfarmEkubo"][0].STRKAmount.decimals,
  ) / 100;

  dbObject.strkfarmAmount = (Number(dbObject.strkfarmAmount) + strkfarmEkuboAmount).toString();

  dbObject.total_amount = totalAmount.toString();
  return {
    xSTRKHoldings: dbObject,
    strkHoldings: {
      strkfarmEkuboAmount: strkfarmEkuboAmount.toString(),
      nostraDexAmount: strkAmountsObject.nostraDexAmount,
      ekuboAmount: strkAmountsObject.ekuboAmount,
    }
  };
}

export function calculatePoints(totalAmount: string, multipler: number): BigInt {
  if (!totalAmount || totalAmount == '0') {
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

export const bigIntToDecimal = (value: bigint): Decimal => new Decimal(value.toString());

export const getDate = (dateString?: string): Date => {
  const date = dateString ? new Date(dateString) : new Date();
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
}