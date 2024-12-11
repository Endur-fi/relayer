export enum Network {
  mainnet = "mainnet",
  sepolia = "sepolia",
  devnet = "devnet",
}

type NetworkAddresses = {
  LST: string;
  WithdrawQueue: string;
  Strk: string;
  Delgator: string[];
};

const sepolia: NetworkAddresses = {
  LST: "0x42de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
  WithdrawQueue:
    "0x254cbdaf8275cb1b514ae63ccedb04a3a9996b1489829e5d6bbaf759ac100b6",
  Strk: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  Delgator: [
    "0x7fc5c5b4c6f30e9914322954750a59a44cf46ae935e6e4bdc7e74f688546041",
    "0x246f8bf539817de93d5fac4eca0052ba40e684a5ddddd7b7027f1744e3d927f",
  ],
};

const mainnet: NetworkAddresses = {
  LST: "0x28d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a",
  WithdrawQueue:
    "0x518a66e579f9eb1603f5ffaeff95d3f013788e9c37ee94995555026b9648b6",
  Strk: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  Delgator: [
    "0x76d15a66bec239c54a727056a8ab04b14f5441a2f559e6eb471cc7e8e878d99",
    "0x4c1408cd9653f282794de18241031b6a1acff17f1fc6603654877c34ce859ba",
  ],
};

export function getAddresses(network: Network): NetworkAddresses {
  switch (network) {
    case 'sepolia': {
      return sepolia;
    }
    case 'mainnet': {
      return mainnet;
    }
    default: {
      throw new Error("Relayer not yet configured for Mainnet");
    }
  }
}
