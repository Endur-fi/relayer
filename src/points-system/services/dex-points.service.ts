import { Injectable } from "@nestjs/common";
import { getNetwork, getProvider, standariseAddress, TryCatchAsync } from "../../common/utils";
import { findClosestBlockInfo, prisma } from "../utils";
import { EkuboCLVault, getMainnetConfig, Global, Pricer, EkuboCLVaultStrategies, logger } from '@strkfarm/sdk';
import { BlockIdentifier, Contract, num, RpcProvider, uint256 } from "starknet";
import EkuboAbi from '../../common/abi/ekubo.abi.json';
import STRKFarmEkuboAbi from "../../common/abi/strkfarm.ekubo.json";
import { getAddresses } from "../../common/constants";
import MyNumber from "../../common/MyNumber";
import { dex_positions, UserPointsType } from '@prisma/my-client';
import axios from "axios";
import ekuboPositionAbi from "../../common/abi/ekubo.position.abi.json";
import { Decimal } from "@prisma/client/runtime/library";

const DEX_INCENTIVE_SCORING_EXPONENT = 5;
const EKUBO_POSITION_ADDRESS =
  "0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067";
const XSTRK_ADDRESS = getAddresses(getNetwork()).LST;
const STRK_DECIMALS = 18;

export interface DexScore {
  ekuboScore: dex_positions[];
  nostraScore: dex_positions[];
  strkfarmEkuboScore: dex_positions[];
}

export interface IDexScoreService {
  getDexBonusPoints(
    address: string,
    blockNumber: number,
    date: Date,
    nostraDEXStrkAmount: number
  ): Promise<DexScore>;
  calculateEkuboBonusScore(
    strkBalance: number,
    currentPrice: number,
    rangeMinPrice: number
  ): number;
  calculateNostraBonusScore(strkBalance: number): number;
  getEkuboHoldings(
    address: string,
    provider: RpcProvider,
    blockNumber: BlockIdentifier,
    truePrice: number,
    date: Date
  ): Promise<dex_positions[]>;
  getTruePrice(blockNumber: number, pricer: Pricer): Promise<number>;
  saveBonusPoints(): Promise<void>;
  getCurrentPrice(blockNumber: number): Promise<number>;
  saveCurrentPrices(): Promise<void>;
}

@Injectable()
export class DexScoreService implements IDexScoreService {
  config = getMainnetConfig(process.env.RPC_URL!);
  pricer: Pricer | null = null;
  strkfarmEkuboCache: { [block_number: number]: {
    total_supply: bigint;
    positionInfo: {
      liquidity: bigint;
      amount0: bigint;
      amount1: bigint;
    };
    bounds: {
      lower: { mag: number; sign: number };
      upper: { mag: number; sign: number };
    };
  } } = {};

  constructor() {}

  async init() {
    const pricer = new Pricer(this.config, await Global.getTokens());
    pricer.start();
    await pricer.waitTillReady();
    this.pricer = pricer;
  }


  async saveCurrentPrices() {
    const startDate = new Date('2025-05-25')
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0); // set to 00:00:00 of the day

    const latestStoredDate = await prisma.price_info.findFirst({
      orderBy: {
        block_number: "desc"
      }
    })
    
    // get job start date
    let processStartDate = startDate;
    if (latestStoredDate) {
      const blockInfo = await prisma.blocks.findFirst({
        where: {
          block_number: {
            lte: latestStoredDate.block_number + 500,
            gte: latestStoredDate.block_number - 500,
          }
        }
      })
      if (!blockInfo) {
        throw new Error(`No block found for latest stored date: ${latestStoredDate.block_number}`);
      }
      processStartDate = new Date(blockInfo.timestamp * 1000); // convert timestamp to Date
    }

    // set to 00:00:00 of the day
    processStartDate.setHours(0, 0, 0, 0);
    processStartDate.setDate(processStartDate.getDate() + 1);

    // to get true price
    const config = getMainnetConfig(process.env.RPC_URL!);
    const pricer = new Pricer(config, await Global.getTokens());
    pricer.start();
    await pricer.waitTillReady();

    while (processStartDate < endDate) {
      // increment date by one day

      const blockInfo = await findClosestBlockInfo(processStartDate);
      if (!blockInfo || !blockInfo.block_number) {
        logger.warn(`No block found for date: ${processStartDate.toISOString().split('T')[0]}`);
        processStartDate.setDate(processStartDate.getDate() + 1);
        throw new Error(`No block found for date: ${processStartDate.toISOString().split('T')[0]}`);
      }

      logger.info(`Saving current prices: ${processStartDate.toISOString().split('T')[0]}, block: ${blockInfo.block_number}`);
      try {
        // const currentPrice = await this.getCurrentPrice(blockInfo.block_number);
        const truePrice = await this.getTruePrice(blockInfo.block_number, pricer);
        await prisma.price_info.create({
          data: {
            block_number: blockInfo.block_number,
            dex_price: "0",
            true_price: truePrice.toString(),
            timestamp: Math.round(processStartDate.getTime() / 1000), // convert to seconds
          },
        })
      } catch (error) {
        logger.error(`Error fetching current price for block ${blockInfo.block_number}`, error);
      }

      processStartDate.setDate(processStartDate.getDate() + 1);
    }

    process.exit(0);
  }

  @TryCatchAsync(3, 10000) // attempts, retry delay in ms
  async getTruePrice(blockNumber: number, pricer: Pricer) {
    const ekuboVaultMod = new EkuboCLVault(getMainnetConfig(process.env.RPC_URL!, blockNumber), pricer, EkuboCLVaultStrategies[0]);
    const truePrice = await ekuboVaultMod.truePrice();
    logger.info(`True price for block ${blockNumber}: ${truePrice}`);
    return truePrice;
  }

  // read price from ekubo contract
  @TryCatchAsync(3, 10000) // attempts, retry delay in ms
  async getCurrentPrice(blockNumber: number) {
    const addr = EKUBO_POSITION_ADDRESS;
    const contract = new Contract(EkuboAbi, addr, getProvider());

    // 0.01%, 200 tick spacing pool
    const poolKey = {
      token0: getAddresses(getNetwork()).LST,
      token1: getAddresses(getNetwork()).Strk,
      fee: '34028236692093847977029636859101184',
      tick_spacing: 200,
      extension: 0
    }

    // 0.05%, 1000 tick spacing pool
    const poolKey2 = {
      ...poolKey,
      fee: '170141183460469235273462165868118016',
      tick_spacing: 1000,
    }

    const blocks = [blockNumber, blockNumber - 200]; // check for 200th block minus also, for averaging. 
    const poolKeys = [poolKey, poolKey2];

    // zip poolKeys and blocks
    const proms: any[] = [];
    for (let i=0; i<poolKeys.length; i++) {
      for (let j=0; j<blocks.length; j++) {
        proms.push(contract.call('get_pool_price', [poolKeys[i]], {
          blockIdentifier: blocks[j],
        }));
      }
    }
    const prices: any[] = await Promise.all(proms);
    
    // average the prices
    const avgPrice = prices.reduce((acc, priceInfo) => {
      const sqrtRatio = EkuboCLVault.div2Power128(
        BigInt(priceInfo.sqrt_ratio.toString())
      );
      const price = sqrtRatio * sqrtRatio;
      return acc + price
    }, 0) / prices.length;
    logger.info(`Average price for block ${blockNumber}: ${avgPrice}`);
    return avgPrice;
  }

  calculateEkuboBonusScore(strkBalance: number, currentPrice: number, rangeMinPrice: number) {
    // S = X₁·(1 + 49·(pₐ/p)ⁿ)
    if (rangeMinPrice > currentPrice) {
      return 0; // if the range min price is greater than current price, no bonus
    }
    const factor = (1 + (49 * ((rangeMinPrice / currentPrice) ** DEX_INCENTIVE_SCORING_EXPONENT)));
    const score = strkBalance * factor;
    return score;
  }

  calculateNostraBonusScore(strkBalance: number) {
    // S = X₁·(1 + 49·(0.5)ⁿ)
    return strkBalance * (1 + (49 * (0.5 ** DEX_INCENTIVE_SCORING_EXPONENT)));
  }
  
  async getDexBonusPoints(address: string, blockNumber: number, date: Date, nostraDEXStrkAmount: number): Promise<DexScore> {
    const START_DATE = new Date('2025-06-01');
    if (date < START_DATE) {
      // points on DEXes havent started yet
      return {
        ekuboScore: [],
        nostraScore: [],
        strkfarmEkuboScore: [],
      };
    }
    const currentPrice = await prisma.price_info.findFirst({
      where: {
        timestamp: Math.round(date.getTime() / 1000), // convert to seconds
      },
      select: {
        dex_price: true,
        true_price: true,
      }
    });
    if (!currentPrice) {
      throw new Error(`No price found for date: ${date.toISOString().split('T')[0]}`);
    }

    const nostraScore: dex_positions[] = [{
      pool_key: 'nostra',
      strk_amount: nostraDEXStrkAmount.toString(),
      score: new Decimal(this.calculateNostraBonusScore(nostraDEXStrkAmount)),
      block_number: blockNumber,
      user_address: address,
      additional_info: "{}",
      timestamp: Math.round(date.getTime() / 1000), // current timestamp in seconds
    }]

    const ekuboPositionDetailsProm = this.getEkuboHoldings(address, getProvider(), blockNumber, Number(currentPrice.true_price), date);
    const strkfarmEkuboScoreProm = this.getSTRKFarmEkuboHoldings(address, blockNumber, Number(currentPrice.true_price), date);

    const [ekuboPositionDetails, strkfarmEkuboScore] = await Promise.all([ekuboPositionDetailsProm, strkfarmEkuboScoreProm]);
    return {
      ekuboScore: ekuboPositionDetails, nostraScore, strkfarmEkuboScore
    }
  }

  async getSTRKFarmEkuboHoldings(userAddress: string, blockNumber: number, truePrice: number, date: Date): Promise<dex_positions[]> {
    const provider = getProvider();
    const addr = '0x01f083b98674bc21effee29ef443a00c7b9a500fd92cf30341a3da12c73f2324';
    const contract = new Contract(STRKFarmEkuboAbi, addr, provider);

    const bal = await contract.call('balance_of', [userAddress], {
      blockIdentifier: blockNumber,
    });

    const dexPosition: dex_positions = { 
      score: new Decimal(0), 
      pool_key: 'strkfarmEkubo', 
      strk_amount: "0",
      additional_info: JSON.stringify({}),
      block_number: blockNumber,
      user_address: userAddress,
      timestamp: Math.round(date.getTime() / 1000), // current timestamp in seconds
    };
    if (Number(bal) === 0) {
      return [dexPosition];
    }

    const totalSupply: any = this.strkfarmEkuboCache[blockNumber]?.total_supply || await contract.call('total_supply', [], {
      blockIdentifier: blockNumber,
    });

    const positionInfo: {
      liquidity: bigint;
      amount0: bigint;
      amount1: bigint;
    } = this.strkfarmEkuboCache[blockNumber] ? this.strkfarmEkuboCache[blockNumber].positionInfo : await contract.call('convert_to_assets', [uint256.bnToUint256(totalSupply.toString())], {
      blockIdentifier: blockNumber,
    }) as any

    const bounds = this.strkfarmEkuboCache[blockNumber]?.bounds || (await contract.call('get_position_key', [], {
      blockIdentifier: blockNumber,
    }) as any).bounds;

    // update cache
    this.strkfarmEkuboCache[blockNumber] = {
      total_supply: BigInt(totalSupply.toString()),
      positionInfo: positionInfo,
      bounds
    }

    const ekuboScore = this.calculateEkuboBonusScore(
      Number(positionInfo.amount1.toString()) / 10 ** STRK_DECIMALS,
      truePrice,
      EkuboCLVault.tickToPrice(EkuboCLVault.i129ToNumber(bounds.lower as any))
    );
    const score = ekuboScore * (Number(bal) / Number(totalSupply));
    return [{ 
      ...dexPosition,
      score: new Decimal(score), 
      strk_amount: (Number(positionInfo.amount1.toString()) / 1e18 * (Number(bal) / Number(totalSupply))).toString(),
      additional_info: JSON.stringify({
        lower_price: EkuboCLVault.tickToPrice(EkuboCLVault.i129ToNumber(bounds.lower as any)),
        upper_price: EkuboCLVault.tickToPrice(EkuboCLVault.i129ToNumber(bounds.upper as any)),
        balance: bal.toString(),
        total_supply: totalSupply.toString(),
        total_strk_amount: positionInfo.amount1.toString(),
      }),
    }];
  }

  getEkuboHoldings = async (
    address: string,
    provider: RpcProvider,
    blockNumber: number,
    truePrice: number,
    date: Date,
  ) => {
    let xSTRKAmount = MyNumber.fromEther("0", 18);
    let STRKAmount = MyNumber.fromEther("0", 18);
  
    const resp = await axios.get(
      `https://mainnet-api.ekubo.org/positions/${address}?showClosed=true`,
      {
        headers: {
          Host: "mainnet-api.ekubo.org",
        },
      },
      // `https://mainnet-api.ekubo.org/positions/0x067138f4b11ac7757e39ee65814d7a714841586e2aa714ce4ececf38874af245`,
    );
    const res = resp.data;
  
    const positionContract = new Contract(
      ekuboPositionAbi,
      EKUBO_POSITION_ADDRESS,
      provider,
    );
  
    const positionsInfo: dex_positions[] = [];

    if (res?.data) {
      const filteredData = res?.data?.filter(
        (position: any) =>
          standariseAddress(position.pool_key.token0) === standariseAddress(getAddresses(getNetwork()).LST) ||
          standariseAddress(position.pool_key.token1) === standariseAddress(getAddresses(getNetwork()).LST),
      );
  
      if (filteredData) {
        for (let i = 0; i < filteredData.length; i++) {
          const position = filteredData[i];
          if (!position.id) continue;
          try {
            const result: any = await positionContract.call(
              "get_token_info",
              [
                position?.id,
                position.pool_key,
                {
                  lower: {
                    mag: Math.abs(position?.bounds?.lower),
                    sign: position?.bounds?.lower < 0 ? 1 : 0,
                  },
                  upper: {
                    mag: Math.abs(position?.bounds?.upper),
                    sign: position?.bounds?.upper < 0 ? 1 : 0,
                  },
                },
              ],
              {
                blockIdentifier: blockNumber ?? "pending",
              },
            );

            const score = this.calculateEkuboBonusScore(
              Number(result.amount1.toString()) / 1e18,
              Number(truePrice),
              Number(EkuboCLVault.tickToPrice(position.bounds.lower)),
            );

            const positionInfo: dex_positions = {
              pool_key: `ekubo_${num.getDecimalString(position.pool_key.fee)}_${num.getDecimalString(position.pool_key.tick_spacing)}`,
              strk_amount: (Number(result.amount1.toString()) / 1e18).toString(),
              score: new Decimal(score), // will be calculated later
              block_number: blockNumber,
              user_address: address,
              additional_info: JSON.stringify({
                lower_price: EkuboCLVault.tickToPrice(position.bounds.lower),
                upper_price: EkuboCLVault.tickToPrice(position.bounds.upper),
              }),
              timestamp: Math.round(date.getTime() / 1000), // current timestamp in seconds
            };
            positionsInfo.push(positionInfo);
          } catch (error: any) {
            if (error.message.includes("NOT_INITIALIZED")) {
              // do nothing
              continue;
            }
            throw error;
          }
        }
      }
    }
  
    return positionsInfo;
  };

  async saveBonusPoints(): Promise<void> {
    // todo ! reset
    const overallStartDate = new Date('2025-06-07');
    const latestDate = await prisma.dex_positions.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
      select: {
        timestamp: true,
      },
    });
    const startDate = latestDate ? new Date(latestDate.timestamp * 1000) : overallStartDate;
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0); // set to 00:00:00 of the day

    while (startDate < endDate) {
      // increment date by one day
      try {
        console.log(`Processing date: ${startDate.toISOString().split('T')[0]}`);
        await this.saveBonusPointsByDate(startDate);
      } catch (error) {
        console.error(`Error processing date ${startDate.toISOString().split('T')[0]}:`, error);
      }
      startDate.setDate(startDate.getDate() + 1);
    }
  }

  async saveBonusPointsByDate(date: Date): Promise<void> {
    date.setHours(0, 0, 0, 0); // set to 00:00:00 of the day
    const dex_positions: dex_positions[] = await prisma.dex_positions.findMany({
      where: {
        timestamp: Math.round(date.getTime() / 1000), // convert to seconds
      },
    });
    if (dex_positions.length === 0) {
      throw new Error(`No dex positions found for date: ${date.toISOString().split('T')[0]}`);
    }
        
    const MULTIPLIER = 0.7;
    const totalSTRK = dex_positions.reduce((acc, pos) => {
      const strkAmount = pos.strk_amount ? parseFloat(pos.strk_amount) : 0;
      return acc + strkAmount;
    }, 0);

    console.log(`Total STRK for date ${date.toISOString().split('T')[0]}: ${totalSTRK}`);

    const totalBonusPoints = totalSTRK * MULTIPLIER;
    const totalScore = dex_positions.reduce((acc, pos) => {
      const score = pos.score ? parseFloat(pos.score.toString()) : 0;
      return acc + score;
    }, 0);
    console.log(`Total score for date ${date.toISOString().split('T')[0]}: ${totalScore}`);
    console.log(`Total bonus points for date ${date.toISOString().split('T')[0]}: ${totalBonusPoints}`);

    for (let i = 0; i < dex_positions.length; i+= 500) {
      const batch = dex_positions.slice(i, i + 500);
      const txs: any[] = [];
      console.log(`Processing batch ${i / 500 + 1} of ${Math.ceil(dex_positions.length / 500)}`);
      for (const pos of batch) {
        const userPoint = prisma.user_points.create({
          data: {
            block_number: pos.block_number,
            user_address: pos.user_address,
            points: new Decimal(pos.score.toString()).mul(totalBonusPoints).div(totalScore).toNumber(),
            cummulative_points: new Decimal(pos.score.toString()).mul(MULTIPLIER).toString(),
            type: UserPointsType.Bonus,
            remarks: 'dex_bonus'
          },
        });
        const aggregationUpdate = prisma.points_aggregated.updateMany({
          where: {
            user_address: pos.user_address,
          },
          data: {
            total_points: {
              increment: new Decimal(pos.score.toString()).mul(MULTIPLIER).toNumber(),
            },
          },
        });
        txs.push(userPoint);
        txs.push(aggregationUpdate);
      }
      await prisma.$transaction(txs);
    }
  }
}