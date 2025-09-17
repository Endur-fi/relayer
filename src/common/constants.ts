import { ContractAddr, Global, TokenInfo, Web3Number } from "@strkfarm/sdk";
import { getNetwork, Network } from "./utils";

/**
 * Returns the decimals of the LST asset
 * @param lstAddress 
 * @returns 
 */
export const getLSTDecimals = (lstAddress: ContractAddr) => {
  const addresses = getAddresses(getNetwork());
  const lstAsset = addresses.LSTs.find((lst) => lst.LST.eq(lstAddress))?.Asset;
  if (!lstAsset) {
    throw new Error(`LST asset not found for address: ${lstAddress.address}`);
  }
  return getTokenDecimals(lstAsset);
};

export const getTokenInfoFromAddr = async (tokenAddress: ContractAddr) => {
  if (getNetwork() === Network.mainnet) {
    return await Global.getTokenInfoFromAddr(tokenAddress);
  } else {
    const tokensInfo: TokenInfo[] = getAllSupportedTokens()
      .map((token, index) => {
        const lstInfo = getLSTInfo(token);
        return {
          address: token,
          decimals: lstInfo.minWithdrawalAutoProcessAmount.decimals,
          symbol: lstInfo.Asset.address.endsWith('c938d') ? 'STRK' : `TBTC${index + 1}`,
          name: lstInfo.Asset.address.endsWith('c938d') ? 'STRK' : `TBTC${index + 1}`,
          logo: '',
          displayDecimals: 4,
        }
      });
    const output = tokensInfo.find((token) => token.address.eq(tokenAddress));
    if (!output) {
      throw new Error(`Sepolia:: Token info not found for address: ${tokenAddress.address}`);
    }
    return output;
  }
}

/**
 * Returns the decimals of the token
 * @param tokenAddress 
 * @returns 
 */
export const getTokenDecimals = async (tokenAddress: ContractAddr) => {
  return (await getTokenInfoFromAddr(tokenAddress)).decimals;
}

/**
 * Returns all the supported tokens for the network
 * @returns 
 */
export const getAllSupportedTokens = () => {
  return [
    ...getAddresses(getNetwork()).LSTs.map((lst) => lst.Asset),
  ]
}

export const getLSTInfo = (lstAddress: ContractAddr) => {
  let output = getAddresses(getNetwork()).LSTs.find((lst) => lst.LST.eq(lstAddress));
  if (!output) {
    // try using asset address
    output = getAddresses(getNetwork()).LSTs.find((lst) => lst.Asset.eq(lstAddress));
    if (!output) {
      throw new Error(`LST info not found for address: ${lstAddress.address}`);
    }
  }
  return output;
}

type NetworkAddresses = {
  // V3 config
  LSTs: {
    LST: ContractAddr;
    WithdrawQueue: ContractAddr;
    Asset: ContractAddr;
    // - amounts below this are not auto processed for withdrawals
    // - 100x this amount will only be processed for stake
    minWithdrawalAutoProcessAmount: Web3Number;
    maxWithdrawalsPerDay: number;
    maxStakePerTx: number; // in a given tx, max stake amount to avoid sending too much to one random validator
  }[];
  ARB_CONTRACT: ContractAddr;
  ValidatorRegistry: ContractAddr;
};

const sepolia: NetworkAddresses = {
  LSTs: [{
    LST: ContractAddr.from("0x036A2c3C56ae806B12A84bB253cBc1a009e3da5469e6a736C483303B864C8e2B"),
    WithdrawQueue: ContractAddr.from("0x06259eC265D650C3Edd85d6B5f563603aA247c360879437D2372AeA7e2148eda"),
    Asset: ContractAddr.from("0x044aD07751Ad782288413C7DB42C48e1c4f6195876BCa3B6CAEF449bb4Fb8d36"),
    minWithdrawalAutoProcessAmount: new Web3Number("0.00001", 8),
    maxWithdrawalsPerDay: 1, // 1BTC
    maxStakePerTx: 100, // 1BTC
  }, {
    LST: ContractAddr.from("0x0226324F63D994834E4729dd1bab443fe50Af8E97C608b812ee1f950ceaE68c7"),
    WithdrawQueue: ContractAddr.from("0x0502B976EC50e85cE7E71997605a7DDbB70386844670ef270b9c721Db1cbE9c0"),
    Asset: ContractAddr.from("0x07E97477601e5606359303cf50C050FD3bA94F66Bd041F4ed504673BA2b81696"),
    minWithdrawalAutoProcessAmount: new Web3Number("0.00001", 8),
    maxWithdrawalsPerDay: 1,
    maxStakePerTx: 100, // 0.1BTC
  }, {
    LST: ContractAddr.from("0x42de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb"),
    WithdrawQueue: ContractAddr.from("0x254cbdaf8275cb1b514ae63ccedb04a3a9996b1489829e5d6bbaf759ac100b6"),
    Asset: ContractAddr.from("0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"),
    minWithdrawalAutoProcessAmount: new Web3Number("0.001", 18),
    maxWithdrawalsPerDay: 2_000_000,
    maxStakePerTx: 100, // 10 STRK
  }],
  ARB_CONTRACT: ContractAddr.from(""),
  ValidatorRegistry: ContractAddr.from("0x05dacc2836c931a9aa7c3011f64f0299b0e91d102bdb527e8d7a52c73fe7af40"),
};


const mainnet: NetworkAddresses = {
  LSTs: [{
    LST: ContractAddr.from("0x28d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a"),
    WithdrawQueue: ContractAddr.from("0x518a66e579f9eb1603f5ffaeff95d3f013788e9c37ee94995555026b9648b6"),
    Asset: ContractAddr.from("0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"),
    minWithdrawalAutoProcessAmount: new Web3Number("10", 18),
    maxWithdrawalsPerDay: 2_000_000,
    maxStakePerTx: 100_000, // 100k STRK
  }],
  ARB_CONTRACT:
    ContractAddr.from("0x5f764d67985cea755149fcc56a251a402ecc86fbc50db6849da91a84806065f"),
  ValidatorRegistry: ContractAddr.from("0x029edbca81c979decd6ee02205127e8b10c011bca1d337141170095eba690931"),
};

export function getAddresses(network: Network): NetworkAddresses {
  switch (network) {
    case "sepolia": {
      return sepolia;
    }
    case "mainnet": {
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
  "F6X92",
  "FHEVD",
  "ZGUXM",
  "IMGYH",
  "ENNIB",
  "FC3BE",
  "5XX81",
  "77CX4",
  "2EF69",
  "7B2FA",
  "ADD83",
  "C83D8",
  "82X13",
  "FC829",
  "B5XD6",
  "79X2C",
  "26CE6",
  "DC322",
];

export const SUPPORTED_TIMEZONES = new Set([
  "America/Los_Angeles",
  "America/New_York",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Kiev",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Honolulu",
  "UTC", // Default fallback
]);
