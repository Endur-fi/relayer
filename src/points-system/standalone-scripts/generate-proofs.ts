import { PrismaClient } from '@prisma/client';
import { num } from 'starknet';

import { MerkleTree } from '../../merkle/lib';
import { Web3Number } from '@strkfarm/sdk';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user_allocation.findMany({
    where: {
      allocation: {
        not: '0',
      },
    },
    select: {
      user_address: true,
      allocation: true,
    },
    orderBy: {
      user_address: 'asc',
    },
  });

  if (users.length === 0) {
    console.log('No users with allocation found.');
    return;
  }

  console.log(`Found ${users.length} users with allocation.`);

  const allocations = users.map((u) => ({
    address: BigInt(num.getDecimalString(u.user_address)),
    cumulative_amount: (() => {
      const allocationStr = u.allocation.toString();
      return BigInt(new Web3Number(allocationStr, 18).toWei());
    })(),
  }));

  const tree = new MerkleTree(allocations);

  const merkleRoot = '0x' + tree.root.value.toString(16);
  console.log('Merkle Root:', merkleRoot);

  // generate and store proofs for each user
  const BATCH_SIZE = 1000; // Adjust batch size as needed
  for (let i = 0; i < allocations.length; i += BATCH_SIZE) {
    const batch = allocations.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allocations.length / BATCH_SIZE)}`);
    await prisma.$transaction(batch.map((user, index) => {
        index++;
        const addressFelt = user.address;

        // Convert allocation to wei consistently with the tree calculation
        const allocationInt = user.cumulative_amount;
        console.log(`${index}: Processing user: ${user.address} with allocation: ${allocationInt.toString()}`);
        const proofObj = tree.address_calldata(addressFelt);

        return prisma.user_allocation.update({
          where: { user_address: num.getHexString(user.address.toString()) },
          data: {
            proof: JSON.stringify(proofObj.proof),
          },
        });

        // console.log(
        //   `User: ${user.address} | Allocation: ${allocationInt.toString()} | Proof: ${JSON.stringify(
        //     proofObj.proof,
        //   )}`,
        // );
      }), { timeout: 500000 }); // Set a timeout for the transaction
  }

  console.log('Merkle Root:', merkleRoot);
  console.log('Merkle proofs generated and stored for all users.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
