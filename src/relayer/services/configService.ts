import { Network, NetworkConfig } from "../../common/types.ts";
import { getAccount, getProvider } from "../../common/utils.ts";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  private static instance: ConfigService;
  private config: NetworkConfig;

  constructor() {
    this.config = {
      provider: getProvider(),
      account: getAccount(),
      network: Network.sepolia,
    };
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get<K extends keyof NetworkConfig>(key: K): NetworkConfig[K] {
    return this.config[key];
  }
}
