import { PrismaClient } from "@prisma/client"
import { ABI as LSTAbi } from "../../../abis/LST";
import { Contract } from "starknet";
import { getProvider } from "../../common/utils";
import { xSTRK_DAPPS } from "../services/points-system.service";

const prisma = new PrismaClient();

async function totalSupply(blockNumber: number) {
  const lst = '0x028d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a'
  const contract = new Contract(LSTAbi, lst, getProvider());
  const supply: any = await contract.call('total_supply', [], {
    blockIdentifier: blockNumber
  })
  console.log(`Total supply at block ${blockNumber}:`, supply / BigInt(1e18));
  return Number(supply / BigInt(1e18));
}

async function nostraXSTRKDebt(blockNumber: number) {
  const dToken = '0x0424638c9060d08b4820aabbb28347fc7234e2b7aadab58ad0f101e2412ea42d'
  const contract = new Contract(LSTAbi, dToken, getProvider());
  const debt: any = await contract.call('total_supply', [], {
    blockIdentifier: blockNumber
  })
  console.log(`Nostra X STRK Debt at block ${blockNumber}:`, debt / BigInt(1e18));
  return Number(debt / BigInt(1e18));
}

/** @param date yyyy-mm-dd */
async function checkSanity(date: string) {
  const blockInfo = await prisma.user_balances.findFirst({
    select: {
      block_number: true
    },
    where: {
      date
    }
  });
  const debt = await nostraXSTRKDebt(blockInfo?.block_number ?? 0);
  const xSTRKSupply = await totalSupply(blockInfo?.block_number ?? 0);

  const data = await prisma.user_balances.findMany({
    where: {
      date,
      user_address: {
        notIn: xSTRK_DAPPS
      }
    },
    select: {
      user_address: true,
      total_amount: true
    }
  })

  // sort by total_amount descending
  const sorted = data.sort((a, b) => Number(b.total_amount) - Number(a.total_amount));
  // log top 10
  console.log(`Top 10 users for ${date}:`);
  sorted.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. User: ${item.user_address}, Amount: ${item.total_amount}`);
  });

  const total = data.reduce((acc, curr) => acc + Number(curr.total_amount), 0);
  console.log(`Total amount for ${date}: ${total}`);

  const effectiveCalc = total - debt;
  console.log(`Effective calculation for ${date}: ${effectiveCalc}`);

  const diff = effectiveCalc - xSTRKSupply;
  console.log(`Difference between effective calculation and xSTRK supply: ${diff}`);
}

async function main() {
  checkSanity('2025-01-02')
}


if (require.main === module) {
  main().catch((error) => {
    console.error("Error in data sanity check:", error);
    process.exit(1);
  });
}