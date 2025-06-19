import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function resetDb(mockBlocks: any[]) {
  await prisma.points_aggregated.deleteMany({});
  await prisma.user_points.deleteMany({});
  await prisma.user_balances.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.blocks.deleteMany({});
  await prisma.blocks.createMany({ data: mockBlocks });
}

export async function createTestUsers(testUsers: { address: string }[], startBlock: number, startTime: number) {
  await prisma.users.createMany({
    data: testUsers.map((user) => ({
      user_address: user.address,
      block_number: startBlock,
      tx_index: 0,
      event_index: 0,
      tx_hash: `0x${user.address.substring(2, 10)}`, // Generate some fake tx hash
      timestamp: startTime,
    })),
  });
}