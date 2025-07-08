import { Logger } from '@nestjs/common';
import { getDefaultStoreConfig, IConfig, Store } from '@strkfarm/sdk';
import assert from 'assert';
import * as dotenv from 'dotenv';
import { Account, BlockIdentifier, num, RpcProvider } from 'starknet';
import { ConfigService } from '../relayer/services/configService';
import { NotifService } from '../relayer/services/notifService';
import { Network } from './constants';
dotenv.config();

export const STRK_DECIMALS = 18;
export const STRK_TOKEN =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d" as const;
export const xSTRK_TOKEN_MAINNET = "0x28d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a";
export const ETH_TOKEN =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const USDC_TOKEN =
  "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
export const USDT_TOKEN =
  "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";
export const WBTC_TOKEN =
  "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac";


export function getProvider(): RpcProvider {
  const env: any = dotenv.config().parsed;
  assert(env.RPC_URL, 'RPC URL not set in .env');
  // use this to explicitly read from .env of this project
  // (VT: I have some global env variables set as well)
  return new RpcProvider({ nodeUrl: env.RPC_URL });
}

export function getAccount(): Account {
  assert(process.env.ACCOUNT_SECURE_PASSWORD, 'ACCOUNT_SECURE_PASSWORD not set in .env');
  assert(process.env.ACCOUNT_KEY, 'ACCOUNT_KEY not set in .env');

  const config: IConfig = {
    provider: getProvider(),
    network: getNetwork(),
    stage: 'production',
  };
  // initialize provider
  const storeConfig = getDefaultStoreConfig(config.network);
  // storeConfig.ACCOUNTS_FILE_NAME = 'account_sepolia.json'
  const store = new Store(config, {
    ...storeConfig,
    PASSWORD: process.env.ACCOUNT_SECURE_PASSWORD || '',
  });

  return store.getAccount(process.env.ACCOUNT_KEY, '0x3');
}

export function getNetwork(): Network {
  assert(process.env.NETWORK, 'Network not configured in .env');

  const network = process.env.NETWORK as string;
  if (network == Network.sepolia) {
    return Network.sepolia;
  } else if (network == Network.mainnet) {
    return Network.mainnet;
  } else {
    throw new Error('Incorrect network configured, check .env file');
  }
}

export function getTGToken() {
  return process.env.TG_TOKEN;
}

/**
 * @description Decorator to retry a method a number of times before throwing an error
 * @param maxAttempts
 * @returns
 */
export function TryCatchAsync(maxAttempts = 1, waitTimeMs = 1000): MethodDecorator {
  const logger = new Logger(TryCatchAsync.name);
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      let retry = 0;
      while (retry < maxAttempts) {
        try {
          // Await the original method for async methods
          return await originalMethod.apply(this, args);
        } catch (error) {
          // Handle the error
          retry += 1;
          if (retry == maxAttempts) {
            if (this && 'notifService' in this) {
              (this as any).notifService.sendMessage(`[${String(propertyKey)}] Error: ${error}`);
            }
            logger.error(`[${String(propertyKey)}] Error:`, error);
            console.log(`[${String(propertyKey)}] Error:`, error);
            throw new Error(`[${String(propertyKey)}] Max retries reached`);
          }
          logger.warn(`[${String(propertyKey)}] failed. Retrying... ${retry + 1} / ${maxAttempts}`);
          await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
        }
      }
    };

    return descriptor;
  };
}

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
};

// function to safely convert decimal/string to BigInt
export function safeToBigInt(value: any): bigint {
  if (value === null || value === undefined) {
    return BigInt(0);
  }

  if (typeof value === 'bigint') {
    return value;
  }

  if (typeof value === 'string') {
    // handle decimal strings by truncating the decimal part
    const floatValue = parseFloat(value);
    return BigInt(Math.floor(floatValue));
  }

  if (typeof value === 'number') {
    return BigInt(Math.floor(value));
  }

  // handle Prisma Decimal type
  if (value && typeof value.toString === 'function') {
    const stringValue = value.toString();
    const floatValue = parseFloat(stringValue);
    return BigInt(Math.floor(floatValue));
  }

  return BigInt(0);
}

export function standariseAddress(address: string | bigint) {
  let _a = address;
  if (!address) {
    _a = "0";
  }
  const a = num.getHexString(num.getDecimalString(_a.toString()));
  return a;
}