import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';

/**
 * This script allocates a fixed amount of STRK to users based on their points.
 * ! Uses latest points aggregated data.
 */

const prisma = new PrismaClient();
const LUMPSUM_POOL_XSTRK = BigInt(250_000 * 1e18); // 250K xSTRK

async function main() {
  const users = await prisma.points_aggregated.findMany({
    where: {
      total_points: { gt: 0 },
    },
    select: {
      user_address: true,
      total_points: true,
    },
  });

  if (users.length === 0) {
    console.warn('No eligible users found.');
    return;
  }

  const totalPoints = users.reduce((sum, u) => sum + BigInt(u.total_points), 0n);
  console.log(`Total points across all users: ${totalPoints}`);
  
  if (totalPoints === 0n) {
    console.warn('Total points is zero.');
    return;
  }

  let netAllocation = 0n;
  const BATCH_SIZE = 500;
  for (let i=0; i<users.length; i += BATCH_SIZE) {
    const batchUsers = users.slice(i, i + BATCH_SIZE);
    const batch: any[] = [];
    console.log(`Processing batch ${Math.ceil(i / BATCH_SIZE) + 1} of ${Math.ceil(users.length / BATCH_SIZE)}`);
    for (const user of batchUsers) {
      const userPoints = BigInt(user.total_points);
      const allocation = Number(LUMPSUM_POOL_XSTRK * 10000n * userPoints / totalPoints - 1n) / 10000; // Subtract 1wei to avoid rounding issues

      // console.log(`User: ${user.user_address}, Points: ${userPoints}, Allocation`, {allocation: allocation.toFixed(0), userPoints: userPoints.toString(), totalPoints: totalPoints.toString()});
      netAllocation += BigInt((new Decimal(allocation)).toFixed(0));

      const xSTRKAmount = (allocation / 1e18).toFixed(4);
      batch.push(prisma.user_allocation.upsert({
        where: { user_address: user.user_address },
        update: { allocation: xSTRKAmount },
        create: {
          user_address: user.user_address,
          allocation: xSTRKAmount,
        },
      }));
      // console.log(`Allocated ${xSTRKAmount} xSTRK to ${user.user_address}`);
    }
    await prisma.$transaction(batch);
  }

  // Check if net allocation matches the pool
  if (netAllocation > LUMPSUM_POOL_XSTRK || netAllocation < (LUMPSUM_POOL_XSTRK - BigInt(1e18))) {
    throw new Error(`Net allocation mismatch: expected near ${LUMPSUM_POOL_XSTRK}, got ${netAllocation}`);
  }

  console.log('Allocation complete.');
}

async function saveAlocations() {
  const allocations = await prisma.user_allocation.findMany({
    where: {

    },
    select: {
      user_address: true,
      allocation: true,
    },
  });

  const filtered = allocations.filter(a => Number(a.allocation) > 0);
  console.log(`Total allocations: ${filtered.length}`);

  const fs = require('fs');
  const outputFile = 'allocationsLocal.json';
  fs.writeFileSync(outputFile, JSON.stringify(filtered, null, 2));
}

function compare() {
  const fs = require('fs');
  const allocations = JSON.parse(fs.readFileSync('allocationsLocal.json', 'utf8'));
  const origAllocations = JSON.parse(fs.readFileSync('allocationsOrig.json', 'utf8'));

  const missingUsersInLocal = origAllocations.filter((a: any) => !allocations.some((b: any) => b.user_address === a.user_address));
  console.log(`Missing users in local: ${missingUsersInLocal.length}`);
  console.log('Missing users:', missingUsersInLocal);
}

if (require.main === module) {
  // saveAlocations();
  compare();
  // main()
  //   .catch((e) => {
  //     console.error(e);
  //     process.exit(1);
  //   })
  //   .finally(async () => {
  //     await prisma.$disconnect();
  //   });
}
