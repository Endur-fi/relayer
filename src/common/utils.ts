import { Logger } from "@nestjs/common";
import { getDefaultStoreConfig, IConfig, Store } from "@strkfarm/sdk";
import assert from "assert";
import * as dotenv from "dotenv";
import { Account, num, RpcProvider } from "starknet";
import { ConfigService } from "../relayer/services/configService";
import { NotifService } from "../relayer/services/notifService";
import { Network } from "./constants";
dotenv.config();

export function getProvider(): RpcProvider {
  const env: any = dotenv.config().parsed;
  assert(env.RPC_URL, "RPC URL not set in .env");
  // use this to explicitly read from .env of this project
  // (VT: I have some global env variables set as well)
  return new RpcProvider({ nodeUrl: env.RPC_URL });
}

export function getAccount(): Account {
  assert(
    process.env.ACCOUNT_SECURE_PASSWORD,
    "ACCOUNT_SECURE_PASSWORD not set in .env"
  );
  assert(process.env.ACCOUNT_KEY, "ACCOUNT_KEY not set in .env");

  const config: IConfig = {
    provider: getProvider(),
    network: getNetwork(),
    stage: "production",
  };
  // initialize provider
  const storeConfig = getDefaultStoreConfig(config.network);
  // storeConfig.ACCOUNTS_FILE_NAME = 'account_sepolia.json'
  const store = new Store(config, {
    ...storeConfig,
    PASSWORD: process.env.ACCOUNT_SECURE_PASSWORD || "",
  });

  return store.getAccount(process.env.ACCOUNT_KEY);
}

export function getNetwork(): Network {
  assert(process.env.NETWORK, "Network not configured in .env");

  const network = process.env.NETWORK as string;
  if (network == Network.sepolia) {
    return Network.sepolia;
  } else if (network == Network.mainnet) {
    return Network.mainnet;
  } else {
    throw new Error("Incorrect network configured, check .env file");
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
export function TryCatchAsync(
  maxAttempts = 1,
  waitTimeMs = 1000
): MethodDecorator {
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
            if (this && "notifService" in this) {
              (this as any).notifService.sendMessage(
                `[${String(propertyKey)}] Error: ${error}`
              );
            }
            logger.error(`[${String(propertyKey)}] Error:`, error);
            console.log(`[${String(propertyKey)}] Error:`, error);
            throw new Error(`[${String(propertyKey)}] Max retries reached`);
          }
          logger.warn(
            `[${String(propertyKey)}] failed. Retrying... ${
              retry + 1
            } / ${maxAttempts}`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
        }
      }
    };

    return descriptor;
  };
}

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NODE_ENV !== "test"
    ) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "test") {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "test") {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "test") {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
};
