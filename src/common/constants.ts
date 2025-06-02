export enum Network {
  mainnet = 'mainnet',
  sepolia = 'sepolia',
  devnet = 'devnet',
}

export const getLSTDecimals = () => 18;

type NetworkAddresses = {
  LST: string;
  WithdrawQueue: string;
  Strk: string;
  Delgator: string[];
  ARB_CONTRACT: string;
};

const sepolia: NetworkAddresses = {
  LST: '0x42de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb',
  WithdrawQueue: '0x254cbdaf8275cb1b514ae63ccedb04a3a9996b1489829e5d6bbaf759ac100b6',
  Strk: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  Delgator: [
    '0x7fc5c5b4c6f30e9914322954750a59a44cf46ae935e6e4bdc7e74f688546041',
    '0x246f8bf539817de93d5fac4eca0052ba40e684a5ddddd7b7027f1744e3d927f',
  ],
  ARB_CONTRACT: '',
};

const mainnet: NetworkAddresses = {
  LST: '0x28d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a',
  WithdrawQueue: '0x518a66e579f9eb1603f5ffaeff95d3f013788e9c37ee94995555026b9648b6',
  Strk: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  Delgator: [
    '0x76d15a66bec239c54a727056a8ab04b14f5441a2f559e6eb471cc7e8e878d99', // 1
    '0x4c1408cd9653f282794de18241031b6a1acff17f1fc6603654877c34ce859ba', // 3
    '0x56f71331dab1e0d790c364fc365118f479648e963e89101725ccbb24083e787', // 2
    '0x4ee7a2dfcd28c4f10af12999004714f0a56753cfe1f35d683edd8016fc18710', // 4
    '0x2e57d9d68e839a510b2b5839bff6b9d3bae46d0548b7867779e41e11e86b2d4', // 5

    '0x7c4955cfb224ba140c8668efa61c3323ef6c07e642f2565f3bece40cdefe74f', // 14
    '0x472f5bef8f656bca4fbff5f509ab9d52179091c3f900586216a54b9c4515ea8', // 16
    '0x2421c00f63b6e46f350088275484123512e07ffac333fe5070907cc22694325', // 18
    '0x6427a04f1dd6d758013e3c236974fc522592d559f571f97ead8c9d55b115d6a', // 20
    '0x59f865098956219987ab460830f683aeb9a1d9d043a185eef0a3cc806703bfc', // 22
    '0x4a8821a816493f167ed76d1d4b310e27d2198069b76d3d98cf1d8b5cc7712e', // 24
    '0xe2bb28bccc03974e8f5ba5acc1602a5f11bcc14cf9e8fa1eb0bd059789dd06', // 23
    '0x337f817840006725f49daf2e60fc52b23f2103fe1b99955506a3cef88ec0f0e', // 21
    '0x1a011b2c425da74f1f5ca93d4977beafb2d3950ab2f7e5c4c9e01baac23d7d8', // 19
    '0x64f1c1a55192d647e8607ac460b282fab2cdccf8bd7d4e7c183cd9aca5fec47', // 17
    '0x4d932dec5a10fac7fa7b34bff85735c0854033779ede5b572e36e35735dca91', // 15
    '0x2067dab5d5b5d44a559f5dbd69f9bef1729c0b58ae2ad5b7e63fee815919d44',
    '0x11e9ce5e132fa6559e361519149577ede3d7eba6f8429c571bc26547d7c8624', // 13
    '0x4480aecc7926b1505ff42af6322b2f20a5b5677422bae65b74e8fbc3f2e72f7', // 12
    '0x6d897b991367d436ce181ca295bd48c5247912514d798523b67ee0bbe1a8c78', // 11
    '0x189d44e13bb402aa8e218f57ae468e769e31975122c741944e223a6310504b1', // 10
    '0x3870d1982d49dc4c08d2c20f58d9bc341248096809fd701b555ff481aa7cc1f', // 7
    '0x3a991153c411fac7e90f22ba2b70020965272fec27c0182a0562fc43a4a6646', // 8
    '0x79c18260689a8d1adcee4e2258cdead1c375ade973b4f65b018b15e03c11d04', // 9
    '0x2c6433caaa6d98b888d16cfa3c3f00cab522d351b51abbcbb3f2973d2b040e9', // 6
  ],
  ARB_CONTRACT: '0x5f764d67985cea755149fcc56a251a402ecc86fbc50db6849da91a84806065f',
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
      return mainnet;
      // throw new Error("Relayer not yet configured for Mainnet");
    }
  }
}

// todo verify this list
export const REFERRERS_WITH_CODE = [
  'F6X92',
  'FHEVD',
  'ZGUXM',
  'IMGYH',
  'ENNIB',
  'FC3BE',
  '5XX81',
  '77CX4',
  '2EF69',
  '7B2FA',
  'ADD83',
  'C83D8',
  '82X13',
  'FC829',
  'B5XD6',
  '79X2C',
  '26CE6',
  'DC322',
  'B0NTV',
  'STRKY',
  'FLEXX',
  'H4A5T',
  'FABIO',
];
