import { PrismaClient } from '@prisma/client';
import { Contract, num, RpcProvider } from 'starknet';

import { MerkleTree } from '../../merkle/lib';
import { Web3Number } from '@strkfarm/sdk';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user_allocation.findMany({
    where: {
      allocation: {
        not: '0',
      },
      // user_address: '0x7eafdaae0ad31f44ce3552146dfa4c449bd7a481135be365433c9f84b367f3b'
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

  const allocations = users.map((u) => {
    if (u.user_address.toLowerCase().includes('f84b367f3b')) {
      console.log('problematic user:', u.user_address);
      console.log('bigint address:', BigInt(num.getDecimalString(u.user_address)).toString());
      console.log('allocation:', u.allocation);
      console.log('allocation as BigInt:', BigInt(new Web3Number(u.allocation.toString(), 18).toWei()).toString());
    }
    return {
      address: BigInt(num.getDecimalString(u.user_address)),
      cumulative_amount: (() => {
        const allocationStr = u.allocation.toString();
        return BigInt(new Web3Number(allocationStr, 18).toWei());
      })(),
    };
  });

  const tree = new MerkleTree(allocations);

  const merkleRoot = '0x' + tree.root.value.toString(16);
  console.log('Merkle Root:', merkleRoot);

  const problematicUser = '0x7eafdaae0ad31f44ce3552146dfa4c449bd7a481135be365433c9f84b367f3b';
  const proof = tree.address_calldata(
    BigInt(num.getDecimalString(problematicUser)),
  );
  console.log('Merkle Proof for problematic user:', JSON.stringify(proof.proof));
  
  await getRoot(
    problematicUser, '348722600000000000000', proof.proof)
  // generate and store proofs for each user
  // const BATCH_SIZE = 1000; // Adjust batch size as needed
  // for (let i = 0; i < allocations.length; i += BATCH_SIZE) {
  //   const batch = allocations.slice(i, i + BATCH_SIZE);
  //   console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allocations.length / BATCH_SIZE)}`);
  //   await prisma.$transaction(batch.map((user, index) => {
  //       index++;
  //       const addressFelt = user.address;

  //       // Convert allocation to wei consistently with the tree calculation
  //       const allocationInt = user.cumulative_amount;
  //       console.log(`${index}: Processing user: ${user.address} with allocation: ${allocationInt.toString()}`);
  //       const proofObj = tree.address_calldata(addressFelt);

  //       return prisma.user_allocation.update({
  //         where: { user_address: num.getHexString(user.address.toString()) },
  //         data: {
  //           proof: JSON.stringify(proofObj.proof),
  //         },
  //       });

  //       // console.log(
  //       //   `User: ${user.address} | Allocation: ${allocationInt.toString()} | Proof: ${JSON.stringify(
  //       //     proofObj.proof,
  //       //   )}`,
  //       // );
  //     }), { timeout: 500000 }); // Set a timeout for the transaction
  // }

  console.log('Merkle Root:', merkleRoot);
  console.log('Merkle proofs generated and stored for all users.');
}

async function checkStoredProofs() {
  const addr = '0x7eafdaae0ad31f44ce3552146dfa4c449bd7a481135be365433c9f84b367f3b';
  const userAlloc = await prisma.user_allocation.findFirst({
    where: {
      user_address: addr,
    },
  });

  if (!userAlloc) {
    console.log(`No user allocation found for address: ${addr}`);
    return;
  }

  const amt = BigInt(new Web3Number(userAlloc.allocation, 18).toWei()).toString();
  await getRoot(addr, amt, JSON.parse(userAlloc.proof || '[]'));
}

async function generateProofToWithdrawFunds() {
  const allocations = [{
    address: BigInt(num.getDecimalString('0x0055741fd3ec832F7b9500E24A885B8729F213357BE4A8E209c4bCa1F3b909Ae')),
    cumulative_amount: BigInt('14851100000000000000'), // 1 ETH
  }]

  const tree = new MerkleTree(allocations);
  const merkleRoot = '0x' + tree.root.value.toString(16);
  console.log('Merkle Root:', merkleRoot);

  const proof = tree.address_calldata(
    BigInt('0x0055741fd3ec832F7b9500E24A885B8729F213357BE4A8E209c4bCa1F3b909Ae'),
  );
  console.log('Merkle Proof:', proof.proof);
}

async function getRoot(
  user: string,
  amount: string,
  proof: string[]
) {
  const addr = '0x021660de54b2e2ba6189c70767f0be7916c8abe0962ff5c7bd912264855bf339';
  const provider = new RpcProvider({
    nodeUrl: 'https://starknet-mainnet.public.blastapi.io',
  });
  const cls = await provider.getClassAt(addr);
  const contract = new Contract(cls.abi, addr, provider);
  const res: any = await contract.call('get_root_for', [
    user,
    amount,
    ["2625311351259413064950393945425958230458260795200775655320822770219756044471","3378637430125126746211067674222644158582031231042783795240154514591255252077","255580891705907511029205766392627294489897155013886873648250669934627384842","3062336582308099876446738630149737811595270960135936285322441624930992932768","1538545698000490006256922511621119621425524841092391333980892970425266422034","2763828461035244643151865125687616223194358971543022936084885787020182270772","3605373858049042924983718615015830030104113109737329319394384857290957952355","1294056075266315160839866934585566712763548288944956412486513999559491997171","3015190313687839737139240555724471429043498297064292460971335991909476766793","3312475541502539094875804827726605141991076433836919676388701692967136765647","1728532217384784863827358227270040623869647778907946499979059953017026303155","485554590557654608082819277542072082618962878155408251576627169703727902445","1433584562065295748256741053336060857496195414464837412978328795512273252816","1306450380890445495501501736518684590314619839671585991453447828064146156143"]
  ]);
  console.log('Computed Root:', num.getHexString(res));
}

// main()
checkStoredProofs()
// generateProofToWithdrawFunds()
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