export declare type Delegator = {
  delegatorIndex: number;
  amount: bigint;
};

interface IStakingStrategyService {
  chooseDelegators(amount: bigint): Promise<Delegator[]>;
}

export class StakingStrategyService implements IStakingStrategyService {
  async chooseDelegators(amount: bigint): Promise<Delegator[]> {
    return [{ delegatorIndex: 1, amount }];
  }
}
