import { Inject, Injectable, Logger } from '@nestjs/common';

import { prisma } from '../../../prisma/client';
import { BotService } from '../../common/services/bot.service';
import { TryCatchAsync } from '../../common/utils';

interface User {
  id: number;
  username: string;
  telegramId: number;
  timezone: string;
  addresses: string[];
}

@Injectable()
export class WeeklyPointsService {
  private readonly logger = new Logger(WeeklyPointsService.name);

  constructor(
    @Inject(BotService)
    private readonly botService: BotService,
  ) {}

  // Process weekly points for all users
  @TryCatchAsync()
  async processWeeklyPointsForAllUsers(): Promise<void> {
    this.logger.log('Running weekly points distribution job...');

    const users = await this.botService.getAllUsers();

    if (!users || users.length === 0) {
      this.logger.warn('No users found for weekly points processing');
      return;
    }

    // Get weekly points delta (current points - previous week snapshot)
    const weeklyPointsData = await this.calculateWeeklyPointsDelta();

    const results = { success: 0, failed: 0 };
    const BATCH_SIZE = 10;

    // Prepare all requests
    const allRequests = [];
    for (const user of users) {
      for (const address of user.addresses) {
        allRequests.push({ user, address });
      }
    }

    // Process requests in batches
    for (let i = 0; i < allRequests.length; i += BATCH_SIZE) {
      const batchRequests = allRequests.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batchRequests.map((req) =>
          this.processUserPoints(req.user, req.address, weeklyPointsData, results),
        ),
      );
    }

    this.logger.log(
      `Weekly points processing complete. Success: ${results.success}, Failed: ${results.failed}`,
    );
  }

  /**
   * Calculate weekly points delta by comparing current points with previous week's snapshot
   */
  @TryCatchAsync()
  private async calculateWeeklyPointsDelta(): Promise<Record<string, string>> {
    this.logger.log('Calculating weekly points delta...');

    try {
      // Get the most recent weekly snapshot (should be from previous week)
      const latestSnapshot = await prisma.cumulative_weekly_snapshot_points.findFirst({
        orderBy: {
          week_start_date: 'desc',
        },
      });

      if (!latestSnapshot) {
        this.logger.error('No previous week snapshot found, cannot calculate weekly delta');
        return {};
      }

      // Get all snapshots from the latest week
      const previousWeekSnapshots = await prisma.cumulative_weekly_snapshot_points.findMany({
        where: {
          week_start_date: latestSnapshot.week_start_date,
        },
        select: {
          user_address: true,
          total_points: true,
        },
      });

      // Get current points for all users
      const currentPoints = await prisma.points_aggregated.findMany({
        select: {
          user_address: true,
          total_points: true,
        },
      });

      // Create maps for easier lookup
      const previousPointsMap: Record<string, bigint> = {};
      previousWeekSnapshots.forEach((snapshot: { user_address: string; total_points: bigint }) => {
        previousPointsMap[snapshot.user_address] = snapshot.total_points;
      });

      const currentPointsMap: Record<string, bigint> = {};
      currentPoints.forEach((points) => {
        currentPointsMap[points.user_address] = points.total_points;
      });

      // Calculate weekly delta for each user
      const weeklyDelta: Record<string, string> = {};

      // Get all unique addresses from both current and previous data
      const allAddresses = new Set([
        ...Object.keys(currentPointsMap),
        ...Object.keys(previousPointsMap),
      ]);

      for (const address of allAddresses) {
        const currentUserPoints = currentPointsMap[address] || BigInt(0);
        const previousUserPoints = previousPointsMap[address] || BigInt(0);

        // Calculate the delta (points gained this week)
        const pointsDelta = currentUserPoints - previousUserPoints;

        // Only include positive deltas (points gained)
        if (pointsDelta > BigInt(0)) {
          weeklyDelta[address] = pointsDelta.toString();
        } else {
          weeklyDelta[address] = '0';
        }
      }

      this.logger.log(`Weekly delta calculated for ${Object.keys(weeklyDelta).length} addresses`);

      return weeklyDelta;
    } catch (error) {
      this.logger.error('Error calculating weekly points delta:', error);
      throw new Error('Failed to calculate weekly points delta');
    }
  }

  /**
   * Process and send points for a single user address
   */
  private async processUserPoints(
    user: User,
    address: string,
    weeklyPoints: Record<string, string>,
    results: { success: number; failed: number },
  ): Promise<void> {
    try {
      // Find points for this address or assign default
      const userPoints = weeklyPoints[address] || '0';

      // Calculate week boundaries for metadata
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - 7); // Previous Sunday
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // Previous Saturday
      weekEnd.setHours(23, 59, 59, 999);

      // Send weekly points event using BotService
      // Bot service will handle timezone-based delivery scheduling
      await this.botService.sendWeeklyPointsEvent(address, userPoints.toString(), 'points', {
        timezone: user.timezone,
        weekStartDate: weekStart.toISOString(),
        weekEndDate: weekEnd.toISOString(),
        processedAt: now.toISOString(),
      });

      results.success++;
      this.logger.log(`Points sent for ${user.username}:${address} - ${userPoints} points`);
    } catch (error: unknown) {
      results.failed++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send points for ${user.username}:${address}: ${errorMessage}`);
    }
  }
}
