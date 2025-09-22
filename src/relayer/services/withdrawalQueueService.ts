import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ContractAddr, Web3Number } from "@strkfarm/sdk";
import { Contract, Call } from "starknet";

import { ConfigService } from "./configService";
import { PrismaService } from "./prismaService";
import { ABI as StrkAbi } from "../../../abis/Strk";
import { ABI as WQAbi } from "../../../abis/WithdrawalQueue";
import { getAddresses, getLSTInfo, getTokenDecimals } from "../../common/constants";
import { getNetwork } from "../../common/utils";

interface IWithdrawalQueueState {
  max_request_id: number;
  unprocessed_withdraw_queue_amount: Web3Number;
  intransit_amount: Web3Number;
}

interface IWithdrawalQueueService {
  claimWithdrawal(assetAddress: ContractAddr, request_id: number): void;
  getClaimWithdrawalCall(assetAddress: ContractAddr, request_id: number): Call;
  claimWithdrawalInRange(assetAddress: ContractAddr, from: number, to: number): void;
  getAssetBalance(assetAddress: ContractAddr): Promise<Web3Number>;
  getWithdrawalQueueState(assetAddress: ContractAddr): Promise<IWithdrawalQueueState>;
}

@Injectable()
export class WithdrawalQueueService implements IWithdrawalQueueService {
  private readonly logger = new Logger(WithdrawalQueueService.name);
  readonly prismaService: PrismaService;
  readonly WQs: {
    WQ: Contract;
    Asset: Contract;
  }[];

  constructor(
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService,
    @Inject(forwardRef(() => PrismaService))
    prismaService: PrismaService
  ) {
    this.WQs = getAddresses(getNetwork()).LSTs.map((lst) => {
      const WQ = new Contract({
        abi: WQAbi,
        address: lst.WithdrawQueue.address,
        providerOrAccount: config.get("account")
      });
      const Asset = new Contract({
        abi: StrkAbi,
        address: lst.Asset.address,
        providerOrAccount: config.get("account")
      });
      return { WQ, Asset };
    })
    this.prismaService = prismaService;
  }

  getWQContract(assetAddress: ContractAddr) {
    const lstInfo = getLSTInfo(assetAddress);
    const output = this.WQs.find((wq) => lstInfo.WithdrawQueue.eqString(wq.WQ.address))?.WQ;
    if (!output) {
      throw new Error(`WQ contract not found for address: ${assetAddress.address}`);
    }
    return output;
  }

  getAssetContract(assetAddress: ContractAddr) {
    const output = this.WQs.find((wq) => assetAddress.eqString(wq.Asset.address))?.Asset;
    if (!output) {
      throw new Error(`Asset contract not found for address: ${assetAddress.address}`);
    }
    return output;
  }

  async claimWithdrawal(assetAddress: ContractAddr, request_id: number) {
    try {
      const res = await this.getWQContract(assetAddress).claim_withdrawal(request_id);
      console.log("Result", res);
    } catch (error) {
      console.error("Failed to claim withdrawal: ", error);
      throw error;
    }
  }

  getClaimWithdrawalCall(assetAddress: ContractAddr, request_id: number | bigint): Call {
    return this.getWQContract(assetAddress).populate("claim_withdrawal", [request_id]);
  }

  claimWithdrawalInRange(assetAddress: ContractAddr, from: number, to: number) {
    let i;
    try {
      for (i = from; i <= to; i++) {
        this.claimWithdrawal(assetAddress, i);
      }
    } catch (error) {
      console.error(`Failed to claim withdrawal in range for ${i}: `, error);
      throw error;
    }
  }

  async getAssetBalance(assetAddress: ContractAddr) {
    const asset = this.getAssetContract(assetAddress);
    const wq = this.getWQContract(assetAddress);
    const amount = await asset.balanceOf(
      wq.address
    );
    return Web3Number.fromWei(amount.toString(), await getTokenDecimals(assetAddress));
  }

  async getWithdrawalQueueState(assetAddress: ContractAddr) {
    const res = await this.getWQContract(assetAddress).get_queue_state();
    return {
      max_request_id: Number(res.max_request_id),
      unprocessed_withdraw_queue_amount: Web3Number.fromWei(
        res.unprocessed_withdraw_queue_amount.toString(),
        await getTokenDecimals(assetAddress)
      ),
      intransit_amount: Web3Number.fromWei(res.intransit_amount.toString(), await getTokenDecimals(assetAddress)),
      cumulative_requested_amount: Web3Number.fromWei(
        res.cumulative_requested_amount.toString(),
        await getTokenDecimals(assetAddress)
      ),
    };
  }
}
