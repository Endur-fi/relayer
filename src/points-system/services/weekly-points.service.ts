import { Inject, Injectable, Logger } from '@nestjs/common';

import { BotService } from '../../common/services/bot.service';
import { TryCatchAsync } from '../../common/utils';
import { prisma } from '../utils';
import { PointsSystemService } from './points-system.service';

interface UserWithTimezone {
  id: number;
  username: string;
  telegramId: number;
  timezone: string;
  addresses: string[];
}

@Injectable()
export class WeeklyPointsService {
  private readonly logger = new Logger(WeeklyPointsService.name);
  private timezoneGroups: Map<string, UserWithTimezone[]> = new Map();

  constructor(
    @Inject(PointsSystemService)
    private readonly pointsSystemService: PointsSystemService,
    @Inject(BotService)
    private readonly botService: BotService,
  ) {}

  /**
   * Process weekly points for all users, respecting their timezones
   */
  @TryCatchAsync()
  async processWeeklyPointsForAllTimezones(): Promise<void> {
    this.logger.log('Running weekly points distribution job...');

    if (!this.timezoneGroups || this.timezoneGroups.size === 0) {
      this.logger.warn('No timezone groups found, initializing...');
      await this.setupTimezoneGroups();

      if (!this.timezoneGroups || this.timezoneGroups.size === 0) {
        this.logger.error('Failed to initialize timezone groups');
        return;
      }
    }

    // Process each timezone group
    for (const [timezone, users] of this.timezoneGroups.entries()) {
      try {
        // Check if it's Sunday in the user's timezone before processing
        const now = new Date();
        const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));

        // Only process if it's Sunday (day 0) in the user's timezone
        if (userTime.getDay() === 0) {
          this.logger.log(`Processing users in timezone: ${timezone} (${users.length} users)`);
          await this.processUsersInTimezone(users, timezone);
        } else {
          this.logger.log(
            `Skipping users in timezone: ${timezone} as it's not Sunday there yet (day: ${userTime.getDay()})`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error processing timezone ${timezone}:`,
          error instanceof Error ? error.message : String(error),
        );
        // Continue processing other timezones even if one fails
        continue;
      }
    }
  }

  /**
   * Processes weekly points for users in a specific timezone
   */
  @TryCatchAsync()
  private async processUsersInTimezone(users: UserWithTimezone[], timezone: string): Promise<void> {
    this.logger.log(`Processing weekly points for ${users.length} users in timezone: ${timezone}`);

    try {
      // Get weekly points delta (current points - previous week snapshot)
      const weeklyPointsData = await this.calculateWeeklyPointsDelta();

      // Track results
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
        `Weekly points processing complete for timezone ${timezone}. Success: ${results.success}, Failed: ${results.failed}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing weekly points for timezone ${timezone}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
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
        this.logger.warn('No previous week snapshot found, using current points as delta');
        return await this.pointsSystemService.getWeeklyPoints();
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
      // Fallback to current points if snapshot calculation fails
      return await this.pointsSystemService.getWeeklyPoints();
    }
  }

  /**
   * Sets up timezone grouping for processing users according to their timezones
   */
  @TryCatchAsync()
  async setupTimezoneGroups(): Promise<void> {
    this.logger.log('Setting up timezone groups...');

    // Get all users and their timezones using BotService
    const users = await this.botService.getAllUsers();

    if (!users || users.length === 0) {
      this.logger.warn('No users found for timezone groups');
      return;
    }

    // Group users by timezone
    const timezoneGroups = new Map<string, UserWithTimezone[]>();

    for (const user of users) {
      // Validate and normalize timezone
      const userTimezone = user.timezone || 'UTC';

      if (!timezoneGroups.has(userTimezone)) {
        timezoneGroups.set(userTimezone, []);
      }
      timezoneGroups.get(userTimezone)?.push({
        ...user,
        timezone: userTimezone, // Ensure normalized timezone
      });
    }

    this.logger.log(`Found ${timezoneGroups.size} different timezones among users`);

    // Log timezone distribution for monitoring
    for (const [timezone, usersInTimezone] of timezoneGroups.entries()) {
      this.logger.log(`Timezone ${timezone}: ${usersInTimezone.length} users`);
    }

    // Store timezone groups
    this.timezoneGroups = timezoneGroups;
  }

  /**
   * Process and send points for a single user address
   */
  private async processUserPoints(
    user: UserWithTimezone,
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
      await this.botService.sendWeeklyPointsEvent(address, userPoints.toString(), 'points', {
        timezone: user.timezone,
        weekStartDate: weekStart.toISOString(),
        weekEndDate: weekEnd.toISOString(),
        processedAt: now.toISOString(),
      });

      results.success++;
      this.logger.log(
        `Points sent for ${user.username}:${address} in timezone ${user.timezone || 'UTC'} - ${userPoints} points`,
      );
    } catch (error: unknown) {
      results.failed++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send points for ${user.username}:${address}: ${errorMessage}`);
    }
  }
}
