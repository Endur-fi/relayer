import { Contract } from "npm:starknet";
import { ABI as LSTAbi } from "../../abis/LST.ts";
import { NetworkConfig } from "../common/types.ts";
import { getAddresses } from "../common/constants.ts";

interface ILST {
  sendToWithdrawQueue(amount: bigint): void;
}

export class LST implements ILST {
  readonly networkConfig: NetworkConfig;
  readonly LST: Contract;

  constructor(networkConfig: NetworkConfig) {
    this.networkConfig = networkConfig;
    this.LST = new Contract(LSTAbi, getAddresses().LST, networkConfig.provider)
      .typedv2(LSTAbi);
  }

  sendToWithdrawQueue(amount: bigint) {
    const LstAddress = getAddresses().LST;
    const lst = new Contract(LSTAbi, LstAddress, this.networkConfig.provider)
      .typedv2(LSTAbi);
    lst.send_to_withdraw_queue(amount);
  }
}
