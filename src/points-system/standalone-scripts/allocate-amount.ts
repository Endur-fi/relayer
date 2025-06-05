import { PrismaClient } from '@prisma/my-client';

/**
 * This script allocates a fixed amount of STRK to users based on their points.
 * ! Uses latest points aggregated data.
 */

const prisma = new PrismaClient();
const LUMPSUM_POOL = BigInt(250_000 * 1e18); // 250K STRK

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

  if (totalPoints === 0n) {
    console.warn('Total points is zero.');
    return;
  }

  let netAllocation = 0n;
  for (const user of users) {
    const userPoints = BigInt(user.total_points);
    const allocation = Number(LUMPSUM_POOL * 10000n * userPoints / totalPoints - 1n) / 10000; // Subtract 1wei to avoid rounding issues

    netAllocation += BigInt(allocation);

    await prisma.user_allocation.upsert({
      where: { user_address: user.user_address },
      update: { allocation: allocation.toFixed(4) },
      create: {
        user_address: user.user_address,
        allocation: allocation.toFixed(4),
      },
    });
    console.log(`Allocated ${allocation} STRK to ${user.user_address}`);
  }

  // Check if net allocation matches the pool
  if (netAllocation > LUMPSUM_POOL || netAllocation < (LUMPSUM_POOL - BigInt(1e18))) {
    throw new Error(`Net allocation mismatch: expected near ${LUMPSUM_POOL}, got ${netAllocation}`);
  }

  console.log('Allocation complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
