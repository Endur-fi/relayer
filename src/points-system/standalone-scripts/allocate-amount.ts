import { PrismaClient } from '@prisma/my-client';

const prisma = new PrismaClient();
const LUMPSUM_POOL = 250_000; // 250K STRK

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
    console.log('No eligible users found.');
    return;
  }

  const totalPoints = users.reduce((sum, u) => sum + BigInt(u.total_points), 0n);

  if (totalPoints === 0n) {
    console.log('Total points is zero.');
    return;
  }

  for (const user of users) {
    const userPoints = BigInt(user.total_points);
    const share = Number(userPoints) / Number(totalPoints);
    const allocation = share * LUMPSUM_POOL;

    await prisma.user_allocation.upsert({
      where: { user_address: user.user_address },
      update: { allocation: allocation.toString() },
      create: {
        user_address: user.user_address,
        allocation: allocation.toString(),
      },
    });
    console.log(`Allocated ${allocation} STRK to ${user.user_address}`);
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
