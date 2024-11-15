// import { getAccount, getProvider } from "../common/utils.ts";
// import { Network, NetworkConfig } from "../common/types.ts";
// import { LST } from "./lstService.ts";
import { PrismaService } from "./prismaService.ts";

function main() {
  // const networkConfig: NetworkConfig = {
  //   network: Network.sepolia,
  //   provider: getProvider(),
  //   account: getAccount(),
  // };
  // const lst = new LST(networkConfig);
  // await lst.sendToWithdrawQueue(BigInt(10));
  const prismaSerivce = new PrismaService();
  prismaSerivce.getDepositsLastDay();
}

main();
