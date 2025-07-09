import assert from "assert";

import { PrismaClient } from "@prisma/client";
import pLimit from "p-limit";
import { Contract } from "starknet";

import { ABI as LSTAbi } from "../../../abis/LST";
import { getProvider } from "../../common/utils";
import { EXCLUSION_LIST, xSTRK_DAPPS } from "../services/points-system.service";

const prisma = new PrismaClient();
const GLOBAL_CONCURRENCY_LIMIT = 25; // total concurrent API calls allowed
const globalLimit = pLimit(GLOBAL_CONCURRENCY_LIMIT);

async function totalSupply(blockNumber: number) {
  const lst =
    "0x028d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a";
  const contract = new Contract(LSTAbi, lst, getProvider());
  const supply: any = await contract.call("total_supply", [], {
    blockIdentifier: blockNumber,
  });
  console.log(`Total supply at block ${blockNumber}:`, supply / BigInt(1e18));
  return Number(supply / BigInt(1e18));
}

async function getXSTRKBalance(userAddress: string, blockNumber: number) {
  const lst =
    "0x028d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a";
  const contract = new Contract(LSTAbi, lst, getProvider());
  const balance: any = await contract.call("balance_of", [userAddress], {
    blockIdentifier: blockNumber,
  });
  return balance;
}

async function getvxSTRKBalance(userAddress: string, blockNumber: number) {
  // const lst = '0x028d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a'
  const v2 =
    "0x040f67320745980459615f4f3e7dd71002dbe6c68c8249c847c82dbe327b23cb";
  const contract = new Contract(LSTAbi, v2, getProvider());
  const balance: any = await contract.call("balance_of", [userAddress], {
    blockIdentifier: blockNumber,
  });
  return balance;
}

async function checkBalance(
  userAddress: string,
  blockNumber: number,
  expected: number,
  balFn: (
    userAddress: string,
    blockNumber: number
  ) => Promise<bigint> = getXSTRKBalance
) {
  const balance: any = await balFn(userAddress, blockNumber);
  console.log(
    `Balance of ${userAddress} at block ${blockNumber}:`,
    balance / BigInt(1e18)
  );
  assert(
    Math.abs(
      Math.round(Number(balance / BigInt(1e18))) - Math.round(expected)
    ) <= Math.max(0.001 * expected, 1),
    `Balance mismatch for user ${userAddress} at block ${blockNumber}. Expected: ${expected}, Actual: ${balance / BigInt(1e18)}`
  );
  return Number(balance / BigInt(1e18));
}

async function nostraXSTRKDebt(blockNumber: number) {
  const dToken =
    "0x0424638c9060d08b4820aabbb28347fc7234e2b7aadab58ad0f101e2412ea42d";
  const contract = new Contract(LSTAbi, dToken, getProvider());
  const debt: any = await contract.call("total_supply", [], {
    blockIdentifier: blockNumber,
  });
  console.log(
    `Nostra X STRK Debt at block ${blockNumber}:`,
    debt / BigInt(1e18)
  );
  return Number(debt / BigInt(1e18));
}

/** @param date yyyy-mm-dd */
async function checkSanity(date: string) {
  const blockInfo = await prisma.user_balances.findFirst({
    select: {
      block_number: true,
    },
    where: {
      date,
    },
  });
  if (!blockInfo) {
    throw new Error(`No block info found for date: ${date}`);
  }

  // await checkBalances(blockInfo.block_number);

  const debt = await nostraXSTRKDebt(blockInfo?.block_number ?? 0);
  const xSTRKSupply = await totalSupply(blockInfo?.block_number ?? 0);

  const data = await prisma.user_balances.findMany({
    where: {
      date,
      user_address: {
        notIn: xSTRK_DAPPS,
      },
    },
    select: {
      user_address: true,
      total_amount: true,
    },
  });

  // sort by total_amount descending
  const sorted = data.sort(
    (a, b) => Number(b.total_amount) - Number(a.total_amount)
  );
  // log top 10
  // console.log(`Top 10 users for ${date}:`);
  // sorted.slice(0, 10).forEach((item, index) => {
  //   console.log(`${index + 1}. User: ${item.user_address}, Amount: ${item.total_amount}`);
  // });

  const total = data.reduce((acc, curr) => acc + Number(curr.total_amount), 0);
  console.log(`Total amount for ${date}: ${total}`);

  const effectiveCalc = total - debt;
  console.log(`Effective calculation for ${date}: ${effectiveCalc}`);
  console.log(`Total xSTRK supply for ${date}: ${xSTRKSupply}`);

  const diff = effectiveCalc - xSTRKSupply;
  console.log(
    `Difference between effective calculation and xSTRK supply: ${diff}`
  );

  assert(
    Math.abs(diff) < 0.015 * xSTRKSupply,
    `Data sanity check failed for date ${date}. Difference is too high: ${diff}`
  );
}

async function checkNoPointsForExcludedDapps(date: string) {
  const blockInfo = await prisma.points_aggregated.findMany({
    where: {
      total_points: {
        gt: 0,
      },
      user_address: {
        in: EXCLUSION_LIST,
      },
    },
  });
  if (!blockInfo || blockInfo.length === 0) {
    console.log(`No points found for excluded dapps on date: ${date}`);
    return;
  }
  console.log(`Points found for excluded dapps on date: ${date}`);
  blockInfo.forEach((item) => {
    console.log(
      `User: ${item.user_address}, Points: ${item.total_points}, block: ${item.block_number}`
    );
  });
}

async function checkBalances(
  blockNumber: number,
  dataKey = "walletAmount",
  checkBalanceFn = getXSTRKBalance
) {
  const users = await prisma.user_balances.findMany({
    where: {
      block_number: blockNumber,
    },
  });

  const proms: any[] = [];
  users.forEach((user) => {
    proms.push(
      globalLimit(() => {
        // console.log(`Checking balance for user`, user, dataKey);
        return checkBalance(
          user.user_address,
          blockNumber,
          Number((user as any)[dataKey]),
          checkBalanceFn
        );
      })
    );
  });
  await Promise.all(proms);
  console.log(`Checked balances for block number: ${blockNumber}`);
}

async function doDAppsSanityCheck(blockNumber: number) {
  const userBalances = await prisma.user_balances.findMany({
    where: {
      block_number: blockNumber,
    },
  });
  const vesuSingleton =
    "0xd8d6dfec4d33bfb6895de9f3852143a17c6f92fd2a21da3d6924d34870160";
  const expectedVesuBalance = userBalances.reduce((acc, curr) => {
    return acc + Number(curr.vesuAmount);
  }, 0);
  await checkBalances(blockNumber, "vesuAmount", getvxSTRKBalance);
  // await checkBalance(vesuSingleton, blockNumber, expectedVesuBalance);
}

async function main() {
  const start = new Date("2025-06-08");
  // while (start < new Date('2025-06-08')) {
  //   await checkSanity(start.toISOString().split('T')[0]);
  //   start.setDate(start.getDate() + 1);
  // }
  await checkSanity("2025-06-08");
  // await doDAppsSanityCheck(1453065);
  // checkNoPointsForExcludedDapps('2025-06-01');
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Error in data sanity check:", error);
    process.exit(1);
  });
}
