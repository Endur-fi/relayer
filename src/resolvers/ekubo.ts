import { Arg, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { prisma} from '../../prisma/client';
import { ContractAddr } from '@strkfarm/sdk';
import { ekubo_position_timeseries as PrismaPositionTimeseries } from '@prisma/client';

@ObjectType()
class EkuboPosition {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  position_id!: string;

  @Field(() => String, { nullable: true })
  pool_fee?: string;

  @Field(() => String, { nullable: true })
  pool_tick_spacing?: string;

  @Field(() => String, { nullable: true })
  extension?: string;

  @Field(() => Int, { nullable: true })
  lower_bound?: number;

  @Field(() => Int, { nullable: true })
  upper_bound?: number;

  @Field(() => String, { nullable: true })
  liquidity?: string;

  @Field(() => String)
  owner_address!: string;

  @Field(() => Int)
  block_number!: number;

  @Field(() => Int)
  tx_index!: number;

  @Field(() => Int)
  event_index!: number;

  @Field(() => Int)
  timestamp!: number;

  @Field(() => String)
  txHash!: string;

  @Field(() => String)
  record_type!: string;

  @Field(() => Date)
  created_at!: Date;

  @Field(() => Date)
  updated_at!: Date;

  @Field(() => Boolean, { nullable: true })
  currently_owned?: boolean;
}

@Resolver()
export class EkuboResolver {
  constructor() {}

  @Query(() => [EkuboPosition])
  async getEkuboPositionsByUser(
    @Arg('userAddress', () => String) userAddress: string,
    @Arg('showClosed', () => Boolean, { defaultValue: false }) showClosed: boolean = false,
    @Arg('toDateTime', () => Date, { defaultValue: new Date() }) toDateTime: Date = new Date(),
  ): Promise<EkuboPosition[]> {
    const toTimestamp = Math.floor(toDateTime.getTime() / 1000);
    const _userAddress = ContractAddr.from(userAddress).address;

    console.log(`Fetching Ekubo positions for user: ${_userAddress}, time: ${toTimestamp}, showClosed: ${showClosed}`);
    
    if (showClosed) {
      return this.getAllUserPositionsWithinTimeframe(_userAddress, toTimestamp);
    } else {
      return this.getCurrentlyOwnedPositions(_userAddress, toTimestamp);
    }
  }

  private async getAllUserPositionsWithinTimeframe(
    userAddress: string,
    toTimestamp: number,
  ): Promise<EkuboPosition[]> {
    // Get all positions that were owned by the user at any point before toTimestamp
    const userPositions = await prisma.$queryRaw<EkuboPosition[]>`
      WITH user_position_ownership AS (
        SELECT DISTINCT position_id
        FROM ekubo_position_timeseries
        WHERE owner_address = ${userAddress}
          AND timestamp <= ${toTimestamp}
          AND (record_type = 'nft_mint' OR record_type = 'nft_transfer')
      ),
      position_states AS (
        SELECT
          id, position_id, pool_fee, pool_tick_spacing, extension,
          lower_bound, upper_bound, owner_address, block_number,
          tx_index, event_index, timestamp, "txHash", record_type,
          created_at, updated_at
        FROM ekubo_position_timeseries
        WHERE position_id IN (SELECT position_id FROM user_position_ownership)
          AND record_type = 'position_updated'
          AND timestamp <= ${toTimestamp}
          AND owner_address = ${userAddress}
        ORDER BY position_id, timestamp DESC
      )
      SELECT * FROM position_states
      ORDER BY timestamp DESC
    `;

    // Filter unique positions by position_id, lower_bound, and upper_bound
    const uniquePositions = new Map<string, EkuboPosition>();
    userPositions.forEach(position => {
      const key = `${position.position_id}-${position.lower_bound}-${position.upper_bound}`;
      if (!uniquePositions.has(key)) {
        uniquePositions.set(key, position);
      }
    });

    console.log(`Found ${uniquePositions.size} unique positions that were owned by user at some point`);

    return Array.from(uniquePositions.values()).map(position => ({
      ...position,
    }));
  }

  private async getCurrentlyOwnedPositions(
    userAddress: string,
    toTimestamp: number,
  ): Promise<EkuboPosition[]> {
    // Get positions currently owned by the user at toTimestamp
    const currentlyOwnedPositions = await prisma.$queryRaw<EkuboPosition[]>`
      WITH ever_had_ownership AS (
        SELECT DISTINCT position_id, owner_address, timestamp
        FROM ekubo_position_timeseries
        WHERE timestamp <= ${toTimestamp}
          AND owner_address = ${userAddress}
          AND (record_type = 'nft_mint' OR record_type = 'nft_transfer')
      ),
      latest_ownership AS (
        SELECT DISTINCT ON (position_id) 
          position_id, owner_address, timestamp
        FROM ekubo_position_timeseries
        WHERE timestamp <= ${toTimestamp}
          AND position_id IN (SELECT position_id FROM ever_had_ownership)
          AND (record_type = 'nft_mint' OR record_type = 'nft_transfer')
        ORDER BY position_id, timestamp DESC
      ),
      currently_owned_positions AS (
        SELECT position_id
        FROM latest_ownership
        WHERE owner_address = ${userAddress}
      ),
      position_states AS (
        SELECT DISTINCT ON (position_id) 
          id, position_id, pool_fee, pool_tick_spacing, extension,
          lower_bound, upper_bound, owner_address, block_number,
          tx_index, event_index, timestamp, "txHash", record_type,
          created_at, updated_at, liquidity
        FROM ekubo_position_timeseries
        WHERE position_id IN (SELECT position_id FROM currently_owned_positions)
          AND timestamp <= ${toTimestamp}
          AND (lower_bound IS NOT NULL AND upper_bound IS NOT NULL and pool_fee IS NOT NULL)
        ORDER BY position_id, timestamp DESC
      )
      SELECT * FROM position_states
      WHERE liquidity IS NOT NULL AND liquidity != '0'
      ORDER BY timestamp DESC
    `;

    console.log(`Found ${currentlyOwnedPositions.length} currently owned positions for user ${userAddress}`);

    return currentlyOwnedPositions.map(position => ({
      ...position,
      // currently_owned: true,
    }));
  }

  // private async checkCurrentOwnership(positionId: string, userAddress: string, toTimestamp: number): Promise<boolean> {
  //   const latestOwnership = await prisma.ekubo_position_timeseries.findFirst({
  //     where: {
  //       position_id: positionId,
  //       timestamp: {
  //         lte: toTimestamp,
  //       },
  //       record_type: {
  //         in: ['nft_mint', 'nft_transfer'],
  //       },
  //     },
  //     orderBy: {
  //       timestamp: 'desc',
  //     },
  //     select: {
  //       owner_address: true,
  //     },
  //   });

  //   return latestOwnership?.owner_address === userAddress;
  // }
}