import { PrismaClient } from "@prisma/client";
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";

const prisma = new PrismaClient();

@ObjectType()
class UserPoints {
  @Field(() => String)
  user_address: string;

  @Field(() => String) // using String for BigInt since GraphQL doesn't support BigInt natively
  total_points: string;

  @Field(() => Number)
  block_number: number;

  @Field(() => Number)
  timestamp: number;

  @Field(() => Date)
  created_on: Date;

  @Field(() => Date)
  updated_on: Date;
}

// custom resolver for querying user points
@Resolver()
export class UserPointsResolver {
  @Query(() => UserPoints, { nullable: true })
  async getUserPoints(
    @Arg("userAddress", () => String) userAddress: string
  ): Promise<UserPoints | null> {
    const point = await prisma.points_aggregated.findUnique({
      where: {
        user_address: userAddress,
      },
    });

    if (point) {
      return {
        ...point,
        total_points: point.total_points.toString(),
      } as unknown as UserPoints;
    }
  }

  @Query(() => [UserPoints])
  async getAllUserPoints(): Promise<UserPoints[]> {
    const points = await prisma.points_aggregated.findMany({
      orderBy: {
        total_points: "desc",
      },
    });

    return points.map(
      (point) =>
        ({
          ...point,
          total_points: point.total_points.toString(),
        } as unknown as UserPoints)
    );
  }
}
