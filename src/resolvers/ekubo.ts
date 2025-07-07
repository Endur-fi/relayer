import { ekubo_positions as PrismaPosition } from "@prisma/client";
import { ContractAddr } from "@strkfarm/sdk";
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { prisma } from "../../prisma/client";

@ObjectType()
class EkuboPosition {
  @Field(() => String)
  pool_fee!: string;

  @Field(() => String)
  pool_tick_spacing!: string;

  @Field(() => String)
  extension!: string;

  @Field(() => String)
  position_id!: string;

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

  @Field(() => Int)
  lower_bound!: number;

  @Field(() => Int)
  upper_bound!: number;

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
    @Arg("userAddress", () => String) userAddress: string,
    @Arg("showClosed", () => Boolean, { defaultValue: false })
    showClosed = false,
    @Arg("fromDateTime", () => Date, { defaultValue: new Date("2024-11-24") })
    fromDateTime: Date = new Date("2024-11-24"),
    @Arg("toDateTime", () => Date, { defaultValue: new Date() })
    toDateTime: Date = new Date()
  ): Promise<EkuboPosition[]> {
    const fromTimestamp = Math.floor(fromDateTime.getTime() / 1000);
    const toTimestamp = Math.floor(toDateTime.getTime() / 1000);
    const _userAddress = ContractAddr.from(userAddress).address;

    if (showClosed) {
      return this.getAllUserPositionsWithinTimeframe(
        _userAddress,
        fromTimestamp,
        toTimestamp
      );
    } else {
      return this.getCurrentlyOwnedPositions(
        _userAddress,
        fromTimestamp,
        toTimestamp
      );
    }
  }

  private async getAllUserPositionsWithinTimeframe(
    userAddress: string,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<EkuboPosition[]> {
    const nftIds = await this.getUserNftIds(userAddress, toTimestamp);

    if (nftIds.length === 0) {
      return [];
    }

    const positions = await this.getPositionsInTimeframe(
      nftIds,
      fromTimestamp,
      toTimestamp
    );

    return this.enrichPositionsWithOwnership(
      positions,
      userAddress,
      toTimestamp
    );
  }

  private async getCurrentlyOwnedPositions(
    userAddress: string,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<EkuboPosition[]> {
    const ownedNftIds = await this.getCurrentlyOwnedNftIds(
      userAddress,
      toTimestamp
    );

    if (ownedNftIds.length === 0) {
      return [];
    }

    const positions = await this.getPositionsInTimeframe(
      ownedNftIds,
      fromTimestamp,
      toTimestamp
    );

    return positions.map((position) => ({
      ...position,
      // currently_owned: true,
    }));
  }

  private async getUserNftIds(
    userAddress: string,
    toTimestamp: number
  ): Promise<string[]> {
    const userNftIds = await prisma.ekubo_nfts.findMany({
      where: {
        to_address: userAddress,
        timestamp: {
          lte: toTimestamp,
        },
      },
      select: {
        nft_id: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return userNftIds.map((nft) => nft.nft_id);
  }

  private async getCurrentlyOwnedNftIds(
    userAddress: string,
    toTimestamp: number
  ): Promise<string[]> {
    const currentlyOwnedNfts = await prisma.$queryRaw<{ nft_id: string }[]>`
      WITH latest_transfers AS (
        SELECT DISTINCT ON (nft_id) nft_id, to_address, timestamp
        FROM ekubo_nfts
        WHERE timestamp <= ${toTimestamp}
        ORDER BY nft_id, timestamp DESC
      )
      SELECT nft_id
      FROM latest_transfers
      WHERE to_address = ${userAddress}
    `;

    return currentlyOwnedNfts.map((nft) => nft.nft_id);
  }

  // This method retrieves positions within a specified timeframe based on NFT IDs.
  private async getPositionsInTimeframe(
    nftIds: string[],
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<PrismaPosition[]> {
    // Get all positions for the NFT IDs, ordered by timestamp
    const allPositions = await prisma.ekubo_positions.findMany({
      where: {
        position_id: {
          in: nftIds,
        },
      },
      orderBy: [{ position_id: "asc" }, { timestamp: "asc" }],
    });

    const relevantPositions: PrismaPosition[] = [];
    const positionsByNftId = this.groupPositionsByNftId(allPositions);

    for (const [_, positions] of positionsByNftId.entries()) {
      const relevantPosition = this.findRelevantPositionForTimeframe(
        positions,
        fromTimestamp,
        toTimestamp
      );

      if (relevantPosition) {
        relevantPositions.push(relevantPosition);
      }
    }

    // Sort by timestamp descending for consistent ordering
    return relevantPositions.sort((a, b) => b.timestamp - a.timestamp);
  }

  private groupPositionsByNftId(
    positions: PrismaPosition[]
  ): Map<string, PrismaPosition[]> {
    const grouped = new Map<string, PrismaPosition[]>();

    for (const position of positions) {
      if (!grouped.has(position.position_id)) {
        grouped.set(position.position_id, []);
      }
      grouped.get(position.position_id)!.push(position);
    }

    return grouped;
  }

  private findRelevantPositionForTimeframe(
    positions: PrismaPosition[],
    fromTimestamp: number,
    toTimestamp: number
  ): PrismaPosition | null {
    // Find the latest position that was created before or during the timeframe
    let relevantPosition: PrismaPosition | null = null;

    for (let i = 0; i < positions.length; i++) {
      const currentPosition = positions[i];
      const nextPosition = positions[i + 1];

      // Case 1: Position created within timeframe
      if (
        currentPosition.timestamp >= fromTimestamp &&
        currentPosition.timestamp <= toTimestamp
      ) {
        relevantPosition = currentPosition;
        break;
      }

      // Case 2: Position created before timeframe
      if (currentPosition.timestamp < fromTimestamp) {
        // Check if this position is "active" during the timeframe
        if (!nextPosition) {
          // No next position, so this position is still active
          relevantPosition = currentPosition;
        } else if (nextPosition.timestamp > fromTimestamp) {
          // Next position is after timeframe starts, so this position was active during timeframe
          relevantPosition = currentPosition;
        }
        // If next position is also before timeframe, continue to next iteration
      }

      // Case 3: Position created after timeframe - skip
      if (currentPosition.timestamp > toTimestamp) {
        break;
      }
    }

    return relevantPosition;
  }

  private async enrichPositionsWithOwnership(
    positions: PrismaPosition[],
    userAddress: string,
    toTimestamp: number
  ): Promise<EkuboPosition[]> {
    return Promise.all(
      positions.map(async (position): Promise<EkuboPosition> => {
        // const currentlyOwned = await this.checkCurrentOwnership(position.position_id, userAddress, toTimestamp);

        return {
          ...position,
          // currently_owned: currentlyOwned,
        };
      })
    );
  }

  private async checkCurrentOwnership(
    positionId: string,
    userAddress: string,
    toTimestamp: number
  ): Promise<boolean> {
    const latestTransfer = await prisma.ekubo_nfts.findFirst({
      where: {
        nft_id: positionId,
        timestamp: {
          lte: toTimestamp,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return latestTransfer?.to_address === userAddress;
  }
}
