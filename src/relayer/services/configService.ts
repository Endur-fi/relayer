import { Network } from "../../common/constants";
import { NetworkConfig } from "../../common/types";
import { getAccount, getProvider, getTGToken } from "../../common/utils";
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
      tgToken: getTGToken(),
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

  isSepolia(): boolean {
    return this.config.network === Network.sepolia;
  }

  provider() {
    return this.config.provider;
  }
}
