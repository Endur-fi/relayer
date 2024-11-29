import * as dotenv from "dotenv";
dotenv.config();
import { Account, num, RpcProvider } from "starknet";
import { Logger } from '@nestjs/common';
import { NotifService } from "../relayer/services/notifService";
import { ConfigService } from "../relayer/services/configService";
import { Network } from "./constants";
import assert = require("assert");

export function getProvider(): RpcProvider {
  const env: any = dotenv.config().parsed;
  assert(env.RPC_URL, "RPC URL not set in .env");
  // use this to explicitly read from .env of this project 
  // (VT: I have some global env variables set as well)
  return new RpcProvider({ nodeUrl: env.RPC_URL });
}

export function getAccount(): Account {
  assert(process.env.PRIVATE_KEY, "PRIVATE KEY not set in .env");
  assert(process.env.ACCOUNT_ADDRESS, "PRIVATE KEY not set in .env");

  // initialize provider
  const provider = getProvider();
  const privateKey = process.env.PRIVATE_KEY as string;
  const accountAddress = process.env.ACCOUNT_ADDRESS as string;
  return new Account(provider, accountAddress, privateKey);
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
export function TryCatchAsync(maxAttempts = 1, waitTimeMs = 1000): MethodDecorator {
  const logger = new Logger(TryCatchAsync.name);;
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
            this.notifService.sendMessage(`[${String(propertyKey)}] Error: ${error}`);
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