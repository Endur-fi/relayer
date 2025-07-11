import { gql } from "@apollo/client";
import { Injectable } from "@nestjs/common";
import {
  dex_positions,
  Prisma,
  PrismaClient,
  UserPointsType,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
  EkuboCLVault,
  EkuboCLVaultStrategies,
  getMainnetConfig,
  Global,
  logger,
  Pricer,
  PricerFromApi,
} from "@strkfarm/sdk";
import axios from "axios";
import { BlockIdentifier, Contract, num, RpcProvider, uint256 } from "starknet";

import EkuboAbi from "../../common/abi/ekubo.abi.json";
import ekuboPositionAbi from "../../common/abi/ekubo.position.abi.json";
import STRKFarmEkuboAbi from "../../common/abi/strkfarm.ekubo.json";
import { getAddresses } from "../../common/constants";
import MyNumber from "../../common/MyNumber";
import {
  apolloClient,
  getNetwork,
  getProvider,
  standariseAddress,
  STRK_TOKEN,
  TryCatchAsync,
} from "../../common/utils";
import { findClosestBlockInfo, getDate, getDateString, prisma } from "../utils";
import { xSTRK_DAPPS } from "./points-system.service";

const DEX_INCENTIVE_SCORING_EXPONENT = 5;
const EKUBO_POSITION_ADDRESS =
  "0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067";
const XSTRK_ADDRESS = getAddresses(getNetwork()).LST;
const STRK_DECIMALS = 18;
const MULTIPLIER = 0.7; // dex points multiplier

export interface DexScore {
  ekuboScore: dex_positions[];
  nostraScore: dex_positions[];
  strkfarmEkuboScore: dex_positions[];
}

const EKUBO_API_QUERY = gql`
  query GetEkuboPositionsByUser(
    $userAddress: String!
    $showClosed: Boolean!
    $toDateTime: DateTimeISO!
  ) {
    getEkuboPositionsByUser(
      userAddress: $userAddress
      showClosed: $showClosed
      toDateTime: $toDateTime
    ) {
      position_id
      timestamp
      lower_bound
      upper_bound
      pool_fee
      pool_tick_spacing
      extension
    }
  }
`;

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
  getTruePrice(blockNumber: number, pricer: PricerFromApi): Promise<number>;
  saveBonusPoints(): Promise<void>;
  getCurrentPrice(blockNumber: number): Promise<number>;
  saveCurrentPrices(): Promise<void>;
}

@Injectable()
export class DexScoreService implements IDexScoreService {
  config = getMainnetConfig(process.env.RPC_URL!);
  pricer: PricerFromApi | null = null;
  strkfarmEkuboCache: {
    [block_number: number]: {
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
    };
  } = {};
  bonusPointsPerScore: {
    [date: string]: { totalScore: number; totalPoints: number };
  } = {};

  async init() {
    const pricer = new PricerFromApi(this.config, await Global.getTokens());
    this.pricer = pricer;
  }

  async saveCurrentPrices() {
    const startDate = getDate("2025-05-25");
    const endDate = getDate();
    console.log(
      `Saving current prices from: ${getDateString(startDate)} to ${getDateString(endDate)}`
    );

    const latestStoredDate = await prisma.price_info.findFirst({
      orderBy: {
        block_number: "desc",
      },
    });

    // get job start date
    let processStartDate = startDate;
    if (latestStoredDate) {
      processStartDate = new Date(latestStoredDate.timestamp * 1000); // convert timestamp to Date
    }

    // set to 00:00:00 of the day
    processStartDate.setDate(processStartDate.getDate() + 1);
    logger.info(
      `Starting to save current prices from: ${processStartDate.toISOString()} to ${endDate.toISOString()}`
    );

    // to get true price
    const config = getMainnetConfig(process.env.RPC_URL!);
    const pricer = new PricerFromApi(config, await Global.getTokens());

    while (processStartDate < endDate) {
      // increment date by one day
      logger.info(
        `saveCurrentPrices: Processing date: ${getDateString(processStartDate)}`
      );
      const blockInfo = await findClosestBlockInfo(processStartDate);
      if (!blockInfo || !blockInfo.block_number) {
        logger.warn(
          `No block found for date: ${getDateString(processStartDate)}`
        );
        processStartDate.setDate(processStartDate.getDate() + 1);
        throw new Error(
          `No block found for date: ${getDateString(processStartDate)}`
        );
      }

      logger.info(
        `Saving current prices: ${getDateString(processStartDate)}, block: ${blockInfo.block_number}`
      );
      try {
        // const currentPrice = await this.getCurrentPrice(blockInfo.block_number);
        const truePrice = await this.getTruePrice(
          blockInfo.block_number,
          pricer
        );
        await prisma.price_info.create({
          data: {
            block_number: blockInfo.block_number,
            dex_price: "0",
            true_price: truePrice.toString(),
            timestamp: Math.round(processStartDate.getTime() / 1000), // convert to seconds
          },
        });
      } catch (error) {
        logger.error(
          `Error fetching current price for block ${blockInfo.block_number}`,
          error
        );
      }

      processStartDate.setDate(processStartDate.getDate() + 1);
    }

    // process.exit(0);
  }

  @TryCatchAsync(3, 10000) // attempts, retry delay in ms
  async getTruePrice(blockNumber: number, pricer: PricerFromApi) {
    const ekuboVaultMod = new EkuboCLVault(
      getMainnetConfig(process.env.RPC_URL!, blockNumber),
      pricer,
      EkuboCLVaultStrategies[0]
    );
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
      fee: "34028236692093847977029636859101184",
      tick_spacing: 200,
      extension: 0,
    };

    // 0.05%, 1000 tick spacing pool
    const poolKey2 = {
      ...poolKey,
      fee: "170141183460469235273462165868118016",
      tick_spacing: 1000,
    };

    const blocks = [blockNumber, blockNumber - 200]; // check for 200th block minus also, for averaging.
    const poolKeys = [poolKey, poolKey2];

    // zip poolKeys and blocks
    const proms: any[] = [];
    for (let i = 0; i < poolKeys.length; i++) {
      for (let j = 0; j < blocks.length; j++) {
        proms.push(
          contract.call("get_pool_price", [poolKeys[i]], {
            blockIdentifier: blocks[j],
          })
        );
      }
    }
    const prices: any[] = await Promise.all(proms);

    // average the prices
    const avgPrice =
      prices.reduce((acc, priceInfo) => {
        const sqrtRatio = EkuboCLVault.div2Power128(
          BigInt(priceInfo.sqrt_ratio.toString())
        );
        const price = sqrtRatio * sqrtRatio;
        return acc + price;
      }, 0) / prices.length;
    logger.info(`Average price for block ${blockNumber}: ${avgPrice}`);
    return avgPrice;
  }

  calculateEkuboBonusScore(
    strkBalance: number,
    currentPrice: number,
    rangeMinPrice: number
  ) {
    // S = X₁·(1 + 49·(pₐ/p)ⁿ)
    if (rangeMinPrice > currentPrice) {
      return 0; // if the range min price is greater than current price, no bonus
    }
    const factor =
      1 + 49 * (rangeMinPrice / currentPrice) ** DEX_INCENTIVE_SCORING_EXPONENT;
    const score = strkBalance * factor;
    return score;
  }

  calculateNostraBonusScore(strkBalance: number) {
    // S = X₁·(1 + 49·(0.5)ⁿ)
    return strkBalance * (1 + 49 * 0.5 ** DEX_INCENTIVE_SCORING_EXPONENT);
  }

  async getDexBonusPoints(
    address: string,
    blockNumber: number,
    date: Date,
    nostraDEXStrkAmount: number
  ): Promise<DexScore> {
    const START_DATE = getDate("2025-06-01");
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
      },
    });
    if (!currentPrice) {
      throw new Error(`No price found for date: ${date.toISOString()}`);
    }

    const nostraScore: dex_positions[] = [
      {
        pool_key: "nostra",
        strk_amount: nostraDEXStrkAmount.toString(),
        score: new Decimal(this.calculateNostraBonusScore(nostraDEXStrkAmount)),
        block_number: blockNumber,
        user_address: address,
        additional_info: "{}",
        is_points_settled: false,
        timestamp: Math.round(date.getTime() / 1000), // current timestamp in seconds
      },
    ];

    const ekuboPositionDetailsProm = this.getEkuboHoldings(
      address,
      getProvider(),
      blockNumber,
      Number(currentPrice.true_price),
      date
    );
    const strkfarmEkuboScoreProm = this.getSTRKFarmEkuboHoldings(
      address,
      blockNumber,
      Number(currentPrice.true_price),
      date
    );

    const [ekuboPositionDetails, strkfarmEkuboScore] = await Promise.all([
      ekuboPositionDetailsProm,
      strkfarmEkuboScoreProm,
    ]);
    return {
      ekuboScore: ekuboPositionDetails,
      nostraScore,
      strkfarmEkuboScore,
    };
  }

  async getSTRKFarmEkuboHoldings(
    userAddress: string,
    blockNumber: number,
    truePrice: number,
    date: Date
  ): Promise<dex_positions[]> {
    const provider = getProvider();
    const addr =
      "0x01f083b98674bc21effee29ef443a00c7b9a500fd92cf30341a3da12c73f2324";
    const contract = new Contract(STRKFarmEkuboAbi, addr, provider);

    const bal = await contract.call("balance_of", [userAddress], {
      blockIdentifier: blockNumber,
    });

    const dexPosition: dex_positions = {
      score: new Decimal(0),
      pool_key: "strkfarmEkubo",
      strk_amount: "0",
      additional_info: JSON.stringify({}),
      block_number: blockNumber,
      user_address: userAddress,
      is_points_settled: false,
      timestamp: Math.round(date.getTime() / 1000), // current timestamp in seconds
    };
    if (Number(bal) === 0) {
      return [dexPosition];
    }

    const totalSupply: any =
      this.strkfarmEkuboCache[blockNumber]?.total_supply ||
      (await contract.call("total_supply", [], {
        blockIdentifier: blockNumber,
      }));

    const positionInfo: {
      liquidity: bigint;
      amount0: bigint;
      amount1: bigint;
    } = this.strkfarmEkuboCache[blockNumber]
      ? this.strkfarmEkuboCache[blockNumber].positionInfo
      : ((await contract.call(
          "convert_to_assets",
          [uint256.bnToUint256(totalSupply.toString())],
          {
            blockIdentifier: blockNumber,
          }
        )) as any);

    const bounds =
      this.strkfarmEkuboCache[blockNumber]?.bounds ||
      (
        (await contract.call("get_position_key", [], {
          blockIdentifier: blockNumber,
        })) as any
      ).bounds;

    // update cache
    this.strkfarmEkuboCache[blockNumber] = {
      total_supply: BigInt(totalSupply.toString()),
      positionInfo: positionInfo,
      bounds,
    };

    const ekuboScore = this.calculateEkuboBonusScore(
      Number(positionInfo.amount1.toString()) / 10 ** STRK_DECIMALS,
      truePrice,
      EkuboCLVault.tickToPrice(EkuboCLVault.i129ToNumber(bounds.lower as any))
    );
    const score = ekuboScore * (Number(bal) / Number(totalSupply));
    return [
      {
        ...dexPosition,
        score: new Decimal(score),
        strk_amount: (
          (Number(positionInfo.amount1.toString()) / 1e18) *
          (Number(bal) / Number(totalSupply))
        ).toString(),
        additional_info: JSON.stringify({
          lower_price: EkuboCLVault.tickToPrice(
            EkuboCLVault.i129ToNumber(bounds.lower as any)
          ),
          upper_price: EkuboCLVault.tickToPrice(
            EkuboCLVault.i129ToNumber(bounds.upper as any)
          ),
          balance: bal.toString(),
          total_supply: totalSupply.toString(),
          total_strk_amount: positionInfo.amount1.toString(),
        }),
      },
    ];
  }

  getEkuboHoldings = async (
    address: string,
    provider: RpcProvider,
    blockNumber: number,
    truePrice: number,
    date: Date
  ) => {
    const xSTRKAmount = MyNumber.fromEther("0", 18);
    const STRKAmount = MyNumber.fromEther("0", 18);

    const blockInfo = await provider.getBlock(blockNumber ?? "latest");
    const resp = await apolloClient.query({
      query: EKUBO_API_QUERY,
      variables: {
        userAddress: address.toLowerCase(),
        showClosed: false, // Fetch both open and closed positions
        toDateTime: new Date(blockInfo.timestamp * 1000).toISOString(),
      },
    });
    const ekuboPositionsResp = resp;
    if (
      !ekuboPositionsResp ||
      !ekuboPositionsResp.data ||
      !ekuboPositionsResp.data.getEkuboPositionsByUser
    ) {
      throw new Error("Failed to fetch Ekubo positions data");
    }
    const ekuboPositions: {
      position_id: string;
      timestamp: string;
      lower_bound: number;
      upper_bound: number;
      pool_fee: string;
      pool_tick_spacing: string;
      extension: string;
    }[] = ekuboPositionsResp.data.getEkuboPositionsByUser;

    const positionContract = new Contract(
      ekuboPositionAbi,
      EKUBO_POSITION_ADDRESS,
      provider
    );

    const positionsInfo: dex_positions[] = [];

    for (let i = 0; i < ekuboPositions.length; i++) {
      const position = ekuboPositions[i];
      if (!position.position_id) continue;
      const poolKey = {
        token0: XSTRK_ADDRESS,
        token1: STRK_TOKEN,
        fee: position.pool_fee,
        tick_spacing: position.pool_tick_spacing,
        extension: position.extension,
      };

      try {
        const result: any = await positionContract.call(
          "get_token_info",
          [
            position?.position_id,
            poolKey,
            {
              lower: {
                mag: Math.abs(position.lower_bound),
                sign: position.lower_bound < 0 ? 1 : 0,
              },
              upper: {
                mag: Math.abs(position.upper_bound),
                sign: position.upper_bound < 0 ? 1 : 0,
              },
            },
          ],
          {
            blockIdentifier: blockNumber ?? "pending",
          }
        );

        const score = this.calculateEkuboBonusScore(
          Number(result.amount1.toString()) / 1e18,
          Number(truePrice),
          Number(EkuboCLVault.tickToPrice(BigInt(position.lower_bound)))
        );

        const positionInfo: dex_positions = {
          pool_key: `ekubo_${num.getDecimalString(poolKey.fee)}_${num.getDecimalString(poolKey.tick_spacing)}_${position.position_id}`,
          strk_amount: (Number(result.amount1.toString()) / 1e18).toString(),
          score: new Decimal(score), // will be calculated later
          block_number: blockNumber,
          user_address: address,
          additional_info: JSON.stringify({
            lower_price: EkuboCLVault.tickToPrice(BigInt(position.lower_bound)),
            upper_price: EkuboCLVault.tickToPrice(BigInt(position.upper_bound)),
          }),
          is_points_settled: false,
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

    return positionsInfo;
  };

  async saveBonusPoints(): Promise<void> {
    // get all users
    const dexPositions = await prisma.dex_positions.findMany({
      orderBy: {
        timestamp: "asc",
      },
      where: {
        is_points_settled: false,
        user_address: {
          notIn: xSTRK_DAPPS
        }
      },
    });

    await this.saveBonusPointsByDate(dexPositions);
    logger.info(`Saved bonus points for ${dexPositions.length} dex positions.`);
  }

  async computeBonusPointsPerScore(
    date: Date
  ): Promise<{ dexPositions: dex_positions[] }> {
    if (this.bonusPointsPerScore[date.toISOString().split("T")[0]]) {
      console.log(
        `Bonus points already computed for date: ${date.toISOString().split("T")[0]}`
      );
      return { dexPositions: [] };
    }

    console.log(
      `Computing bonus points for date: ${date.toISOString().split("T")[0]}`
    );
    const dex_positions: dex_positions[] = await prisma.dex_positions.findMany({
      where: {
        timestamp: Math.round(date.getTime() / 1000), // convert to seconds
      },
    });
    if (dex_positions.length === 0) {
      throw new Error(
        `No dex positions found for date: ${date.toISOString().split("T")[0]}`
      );
    }

    const totalSTRK = dex_positions.reduce((acc, pos) => {
      const strkAmount = pos.strk_amount ? parseFloat(pos.strk_amount) : 0;
      return acc + strkAmount;
    }, 0);

    console.log(
      `Total STRK for date ${date.toISOString().split("T")[0]}: ${totalSTRK}`
    );

    const totalBonusPoints = totalSTRK * MULTIPLIER;
    const totalScore = dex_positions.reduce((acc, pos) => {
      const score = pos.score ? parseFloat(pos.score.toString()) : 0;
      return acc + score;
    }, 0);
    console.log(
      `Total score for date ${date.toISOString().split("T")[0]}: ${totalScore}`
    );
    console.log(
      `Total bonus points for date ${date.toISOString().split("T")[0]}: ${totalBonusPoints}`
    );

    this.bonusPointsPerScore[date.toISOString().split("T")[0]] = {
      totalScore: totalScore,
      totalPoints: totalBonusPoints,
    };

    return {
      dexPositions: dex_positions,
    };
  }

  async processDexPosition(
    dexPosition: dex_positions,
    tx: Prisma.TransactionClient
  ) {
    // compute bonus points for the date
    const date = new Date(dexPosition.timestamp * 1000); // convert timestamp to Date
    let totalBonusPointsInfo =
      this.bonusPointsPerScore[date.toISOString().split("T")[0]];
    if (!totalBonusPointsInfo) {
      const res = await this.computeBonusPointsPerScore(date);
      totalBonusPointsInfo =
        this.bonusPointsPerScore[date.toISOString().split("T")[0]];
    }
    const totalBonusPoints = totalBonusPointsInfo.totalPoints;
    const totalScore = totalBonusPointsInfo.totalScore;
    const pos = dexPosition;
    // add user points
    const points = Math.round(
      new Decimal(pos.score.toString())
        .mul(totalBonusPoints)
        .div(totalScore)
        .toNumber()
    );
    await tx.user_points.upsert({
      where: {
        id: {
          user_address: pos.user_address,
          block_number: pos.block_number,
          type: UserPointsType.Bonus,
        },
      },
      update: {
        points: {
          increment: points,
        },
        // cummulative_points: {
        //   increment: points,
        // }
      },
      create: {
        block_number: pos.block_number,
        user_address: pos.user_address,
        type: UserPointsType.Bonus,
        points: points,
        // cummulative_points: points,
        remarks: "dex_bonus",
      },
    });

    // set is settled
    await tx.dex_positions.update({
      where: {
        id: {
          user_address: pos.user_address,
          timestamp: pos.timestamp,
          pool_key: pos.pool_key,
        },
      },
      data: {
        is_points_settled: true,
      },
    });

    // update aggregated points
    await tx.points_aggregated.updateMany({
      where: {
        user_address: pos.user_address,
      },
      data: {
        total_points: {
          increment: points,
        },
      },
    });
  }

  async saveBonusPointsByDate(dexPositions: dex_positions[]): Promise<void> {
    const BATCH_SIZE = 50;
    const TOTAL_BATCHES = Math.ceil(dexPositions.length / BATCH_SIZE);
    for (let i = 0; i < dexPositions.length; i += BATCH_SIZE) {
      const batch = dexPositions.slice(i, i + BATCH_SIZE);
      const CURRENT_BATCH = Math.ceil(i / BATCH_SIZE) + 1;
      logger.verbose(
        `Processing batch ${CURRENT_BATCH} of ${TOTAL_BATCHES} for date: ${new Date(batch[0].timestamp * 1000).toISOString().split("T")[0]}`
      );
      await prisma.$transaction(
        async (tx) => {
          for (const dexPosition of batch) {
            try {
              await this.processDexPosition(dexPosition, tx);
            } catch (error) {
              console.error(
                `Error processing dex position for user ${dexPosition.user_address} on date ${new Date(dexPosition.timestamp * 1000).toISOString().split("T")[0]}:`,
                error
              );
              throw error; // rethrow to trigger retry
            }
          }
        },
        { timeout: 300000 }
      );
      logger.verbose(
        `Processed batch of ${batch.length} dex positions for date: ${new Date(batch[0].timestamp * 1000).toISOString().split("T")[0]}`
      );
    }
  }
}
