import { Field, Int, ObjectType, Query, Resolver } from "type-graphql";

import { prisma } from "../../prisma/client";
import MyNumber from "../common/MyNumber";

@Resolver()
class WithdrawQueueStatsResolver {
  @Query(() => WithdrawQueueStats)
  async getPendingWithdrawStats(): Promise<WithdrawQueueStats> {
    const pendingWithdraws = await prisma.withdraw_queue.findMany({
      where: {
        is_claimed: false,
        is_rejected: false,
      },
      select: {
        amount_strk: true,
      },
    });

    let totalAmountStrk = MyNumber.fromZero();

    for (const withdraw of pendingWithdraws) {
      try {
        totalAmountStrk = totalAmountStrk.operate(
          "plus",
          withdraw.amount_strk.toString()
        );
      } catch (error) {
        console.error("Error adding withdraw amount:", error);
      }
    }

    return {
      pendingCount: pendingWithdraws.length,
      totalAmountStrk: totalAmountStrk.toString(),
    };
  }
}

@ObjectType()
class WithdrawQueueStats {
  @Field(() => Int)
  pendingCount: number;

  @Field(() => String)
  totalAmountStrk: string;
}

export default WithdrawQueueStatsResolver;
