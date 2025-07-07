import { PrismaClient } from "@prisma/client";
import { Web3Number } from "@strkfarm/sdk";
import { Contract, num, RpcProvider } from "starknet";

import { MerkleTree } from "../../merkle/lib";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user_allocation.findMany({
    where: {
      allocation: {
        not: "0",
      },
    },
    select: {
      user_address: true,
      allocation: true,
    },
    orderBy: {
      user_address: "asc",
    },
  });

  if (users.length === 0) {
    console.log("No users with allocation found.");
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

  const merkleRoot = "0x" + tree.root.value.toString(16);
  console.log("Merkle Root:", merkleRoot);

  // generate and store proofs for each user
  const BATCH_SIZE = 1000; // Adjust batch size as needed
  for (let i = 0; i < allocations.length; i += BATCH_SIZE) {
    const batch = allocations.slice(i, i + BATCH_SIZE);
    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allocations.length / BATCH_SIZE)}`
    );
    await prisma.$transaction(
      batch.map((user, index) => {
        index++;
        const addressFelt = user.address;

        // Convert allocation to wei consistently with the tree calculation
        const allocationInt = user.cumulative_amount;
        console.log(
          `${index}: Processing user: ${user.address} with allocation: ${allocationInt.toString()}`
        );
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
      }),
      { timeout: 500000 }
    ); // Set a timeout for the transaction
  }

  console.log("Merkle Root:", merkleRoot);
  console.log("Merkle proofs generated and stored for all users.");
}

async function generateProofToWithdrawFunds() {
  const allocations = [
    {
      address: BigInt(
        num.getDecimalString(
          "0x0055741fd3ec832F7b9500E24A885B8729F213357BE4A8E209c4bCa1F3b909Ae"
        )
      ),
      cumulative_amount: BigInt("14851100000000000000"), // 1 ETH
    },
  ];

  const tree = new MerkleTree(allocations);
  const merkleRoot = "0x" + tree.root.value.toString(16);
  console.log("Merkle Root:", merkleRoot);

  const proof = tree.address_calldata(
    BigInt("0x0055741fd3ec832F7b9500E24A885B8729F213357BE4A8E209c4bCa1F3b909Ae")
  );
  console.log("Merkle Proof:", proof.proof);
}

async function getRoot() {
  const addr =
    "0x02cb0c045ca7c0ef8c1622c964310224e529fb24cb6d2c080052aec3deaad2fc";
  const provider = new RpcProvider({
    nodeUrl: "https://starknet-mainnet.public.blastapi.io",
  });
  const cls = await provider.getClassAt(addr);
  const contract = new Contract(cls.abi, addr, provider);
  const res: any = await contract.call("get_root_for", [
    "0x0055741fd3ec832F7b9500E24A885B8729F213357BE4A8E209c4bCa1F3b909Ae",
    "4192100000000000000", // 1 ETH
    ["0x3efa59f8987021f1c86b53fdad3b22a9a4b3c444aac9071447f5be2aec2064"],
  ]);
  console.log("Computed Root:", num.getHexString(res));
}

// main()
generateProofToWithdrawFunds()
  // getRoot()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Root
// 0x51368126012a878e215fc3598f4db9e3286d6047ddf6239fd9074be601c68fe
