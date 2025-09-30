import { forwardRef, Inject, Injectable, Logger, Provider } from "@nestjs/common";
import { ConfigService } from "./configService";
import { Abi, Call, CallData, Contract, hash, RpcProvider, TransactionExecutionStatus } from "starknet";
import { ABI as AggregatedViewCallAbi } from "../../../abis/AggregatedViewCallAbi";
import assert from "assert";

const AGGREGATED_VIEW_CALL_CONTRACT = '0x05754af3760f3356da99aea5c3ec39ccac7783d925a19666ebbeca58ff0087f4';

interface ViewCallInfo {
  to: string;
  selector: string;
  data_offset: string;
  data_len: string;
}

export interface ViewCall extends Call {
  abi: Abi;
}

@Injectable()
export class RPCWrapper {
  private readonly logger = new Logger(RPCWrapper.name);
  private readonly provider: RpcProvider;
  private readonly aggregatedViewCall: Contract;
  private readonly config: ConfigService;

  constructor(
    @Inject(forwardRef(() => ConfigService))
    config: ConfigService
  ) {
    this.config = config;
    this.provider = config.provider();
    this.aggregatedViewCall = new Contract({
      abi: AggregatedViewCallAbi,
      address: AGGREGATED_VIEW_CALL_CONTRACT,
      providerOrAccount: this.provider
    });
  }

  // Call is usually used for write calls, but for simplicity, we use it for view calls as well
  async aggregateViewCalls<T extends Array<any>>(calls: ViewCall[]) {
    let offset = 0;
    let calldata: any[] = [];
    const callArray = calls.map((call) => {
      const _offset = offset;
      offset += (call.calldata as Array<string>).length;
      calldata.push(...(call.calldata as Array<string>));
      return {
        to: call.contractAddress,
        selector: hash.getSelectorFromName(call.entrypoint),
        data_offset: _offset,
        data_len: (call.calldata as Array<string>).length
      }
    });
    const result: any = await this.aggregatedViewCall.call("aggregate", [
      callArray,
      calldata
    ]);
    const allData = result.retdata;
    // allData is like a flattened serialised version of T like [T[0].length, T[0][0], T[0][1], ..., T[1][0], T[1][1], ...]
    offset = 0;
    const output: T = [] as unknown as T;
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const calldata = new CallData(call.abi);
      let len = Number(allData[offset]);
      const data = allData.slice(offset + 1, offset + len + 1);
      offset += len + 1;
      const _output = calldata.parse(call.entrypoint, data);
      output.push(_output);
    }
    return output;
  }

  async aggregateViewCall<T>(call: ViewCall) {
    return (await this.aggregateViewCalls<T[]>([call]))[0] as T;
  }

  async executeTransactions(calls: Call[], remark: string) {
    const account = this.config.get("account");
    let retries = 0;
    while (retries < 10) {
      try {
        const tx = await account.execute(calls);
        this.logger.log(`executeTransactions tx: ${tx.transaction_hash} with remark: ${remark}`);
        await this.provider.waitForTransaction(tx.transaction_hash, {
          successStates: [TransactionExecutionStatus.SUCCEEDED],
        });
        this.logger.log(`executeTransactions tx confirmed: ${tx.transaction_hash} with remark: ${remark}`);
        return tx;
      } catch (error) {
        this.logger.warn(`executeTransactions tx failed retry ${retries}: ${error}`);
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    throw new Error(`executeTransactions tx failed after 10 retries`);
  }
}