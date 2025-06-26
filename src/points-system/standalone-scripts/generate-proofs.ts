import { PrismaClient } from '@prisma/client';
import { num } from 'starknet';

import { MerkleTree } from '../../merkle/lib';

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

  const allocations = users.map((u) => ({
    address: BigInt(num.getDecimalString(u.user_address)),
    cumulative_amount: (() => {
      const allocationStr = u.allocation.toString();
      const [intPart, decPart = ''] = allocationStr.split('.');
      const paddedDecPart = decPart.padEnd(18, '0').slice(0, 18);
      return BigInt(intPart + paddedDecPart);
    })(),
  }));

  const tree = new MerkleTree(allocations);

  const merkleRoot = '0x' + tree.root.value.toString(16);
  console.log('Merkle Root:', merkleRoot);

  // generate and store proofs for each user
  for (const user of users) {
    const addressFelt = BigInt(num.getDecimalString(user.user_address));

    // Convert allocation to wei consistently with the tree calculation
    const allocationStr = user.allocation.toString();
    const [intPart, decPart = ''] = allocationStr.split('.');
    const paddedDecPart = decPart.padEnd(18, '0').slice(0, 18);
    const allocationInt = BigInt(intPart + paddedDecPart);

    const proofObj = tree.address_calldata(addressFelt);

    await prisma.user_allocation.update({
      where: { user_address: user.user_address },
      data: {
        proof: JSON.stringify(proofObj.proof),
        merkle_root: merkleRoot,
      },
    });

    console.log(
      `User: ${user.user_address} | Allocation: ${allocationInt.toString()} | Proof: ${JSON.stringify(
        proofObj.proof,
      )}`,
    );
  }

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
