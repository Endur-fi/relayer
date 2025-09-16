import assert from "assert";

import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ContractAddr, Web3Number } from "@strkfarm/sdk";
import { Call, Contract, TransactionExecutionStatus, uint256 } from "starknet";

import { ConfigService } from "./configService";
import { PrismaService } from "./prismaService";
import { ABI as LSTAbi } from "../../../abis/LST";
import { ABI as AssetAbi } from "../../../abis/Strk";
import { getAddresses, getLSTInfo, getTokenDecimals } from "../../common/constants";
import { getNetwork } from "../../common/utils";

interface ILSTService {
  sendToWithdrawQueue(assetAddress: ContractAddr, amount: Web3Number): void;
  getAssetBalance(assetAddress: ContractAddr): Promise<Web3Number>;
  exchangeRate(assetAddress: ContractAddr): Promise<number>;
}

@Injectable()
export class LSTService implements ILSTService {
  private readonly logger = new Logger(LSTService.name);
  readonly prismaService: PrismaService;
  readonly config: ConfigService;
  readonly LSTs: {
    LST: Contract;
    Asset: Contract;
  }[];

  constructor(
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => PrismaService))
    prismaService: PrismaService
  ) {
    this.config = config;
    this.LSTs = getAddresses(getNetwork()).LSTs.map((lst) => ({
      LST: new Contract({
        abi: LSTAbi,
        address: lst.LST.address,
        providerOrAccount: config.get("account")
      }),
      Asset: new Contract({
        abi: AssetAbi,
        address: lst.Asset.address,
        providerOrAccount: config.get("account")
      })
    }));

    this.prismaService = prismaService;
  }

  getLSTContract(assetAddress: ContractAddr) {
    const lstInfo = getLSTInfo(assetAddress);
    const output = this.LSTs.find((lst) => lstInfo.LST.eqString(lst.LST.address))?.LST;
    if (!output) {
      throw new Error(`LST contract not found for address: ${assetAddress.address}`);
    }
    return output;
  }

  getAssetContract(assetAddress: ContractAddr) {
    const output = this.LSTs.find((lst) => assetAddress.eqString(lst.Asset.address))?.Asset;
    if (!output) {
      throw new Error(`Asset contract not found for address: ${assetAddress.address}`);
    }
    return output;
  }

  async sendToWithdrawQueue(assetAddress: ContractAddr, amount: Web3Number) {
    try {
      const lstBalance = await this.getAssetBalance(assetAddress);
      const lst = this.getLSTContract(assetAddress);
      assert(
        lstBalance.gte(amount),
        "Not enough balance to send to Withdrawqueue"
      );
      const tx = await lst.send_to_withdraw_queue(
        uint256.bnToUint256(amount.toWei())
      );
      this.logger.log(`Send to WQ tx: `, tx);
      await this.config.provider().waitForTransaction(tx.transaction_hash);
      this.logger.log(`Send to WQ tx confirmed`);
    } catch (error) {
      console.error("Failed to send to withdraw queue:", error);
      throw error;
    }
  }

  async getAssetBalance(assetAddress: ContractAddr) {
    const asset = this.getAssetContract(assetAddress);
    const amount = await asset.balanceOf(assetAddress.address);
    return Web3Number.fromWei(amount.toString(), await getTokenDecimals(assetAddress));
  }

  async exchangeRate(assetAddress: ContractAddr) {
    const lst = this.getLSTContract(assetAddress);
    const totalAssetsRes = await lst.call("total_assets", []);
    const totalSupplyRes = await lst.call("total_supply", []);
    const totalAssets = Web3Number.fromWei(totalAssetsRes.toString(), await getTokenDecimals(assetAddress));
    const totalSupply = Web3Number.fromWei(totalSupplyRes.toString(), await getTokenDecimals(assetAddress));
    return Number(totalAssets.toString()) / Number(totalSupply.toString());
  }
}
