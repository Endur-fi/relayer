import { getNetwork } from "./utils.ts";
import { Network } from "./types.ts";

const sepolia = {
  LST: "0x42de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
  WithdrawQueue:
    "0x4b55e5722cdc06d585862f4fb4952f5471bacfb5d8870569183e1bf88cf01c9",
  Treasury:
    "0x054D159fA98b0f67b3d3B287aaE0340BF595D8f2A96ed99532785AEEF08c1eDe",
  Admin: "0x054D159fA98b0f67b3d3B287aaE0340BF595D8f2A96ed99532785AEEF08c1eDe",
  Delgator: [
    "0x7fc5c5b4c6f30e9914322954750a59a44cf46ae935e6e4bdc7e74f688546041",
    "0x246f8bf539817de93d5fac4eca0052ba40e684a5ddddd7b7027f1744e3d927f",
  ],
};

const mainnet = {
  LST: "0x42de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
  WithdrawQueue:
    "0x4b55e5722cdc06d585862f4fb4952f5471bacfb5d8870569183e1bf88cf01c9",
  Treasury:
    "0x054D159fA98b0f67b3d3B287aaE0340BF595D8f2A96ed99532785AEEF08c1eDe",
  Admin: "0x054D159fA98b0f67b3d3B287aaE0340BF595D8f2A96ed99532785AEEF08c1eDe",
  Delgator: [
    "0x7fc5c5b4c6f30e9914322954750a59a44cf46ae935e6e4bdc7e74f688546041",
    "0x246f8bf539817de93d5fac4eca0052ba40e684a5ddddd7b7027f1744e3d927f",
  ],
};

export function getAddresses() {
  const network = getNetwork();
  switch (network) {
    case Network.sepolia: {
      return sepolia;
    }
    case Network.mainnet: {
      return mainnet;
    }
    default: {
      throw new Error("Relayer not yet configured for Mainnet");
    }
  }
}
