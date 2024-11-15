import { Contract } from "https://esm.sh/starknet@6.11.0";
import { ABI as LSTAbi } from "../../abis/LST.ts";
import { NetworkConfig } from "../common/types.ts";
import { getAddresses } from "../common/constants.ts";

interface ILST {
  sendToWithdrawQueue(amount: bigint): void;
  stake(delegator: string, amount: bigint): void;
}

export class LST implements ILST {
  readonly networkConfig: NetworkConfig;
  readonly LST;

  constructor(networkConfig: NetworkConfig) {
    this.networkConfig = networkConfig;
    this.LST = new Contract(LSTAbi, getAddresses().LST, networkConfig.account)
      .typedv2(LSTAbi);
  }

  sendToWithdrawQueue() {
    // this.LST.send_to_withdraw_queue(amount);
  }

  stake(delegator: string, amount: bigint) {
    this.LST.stake(delegator, amount);
  }
}
