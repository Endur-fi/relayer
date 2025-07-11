import { Inject, Injectable, Logger } from "@nestjs/common";

import { PointsSystemService } from "./points-system.service";

import { SUPPORTED_TIMEZONES } from "../../common/constants";
import { BotService } from "../../common/services/bot.service";
import { TryCatchAsync } from "../../common/utils";

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
  private readonly userTimezones: Map<string, string> = new Map();
  private readonly lastProcessedDate: Map<string, Date> = new Map();
  private timezoneGroups: Map<string, UserWithTimezone[]> = new Map();

  constructor(
    @Inject(PointsSystemService)
    private readonly pointsSystemService: PointsSystemService,
    @Inject(BotService)
    private readonly botService: BotService
  ) {}

  /**
   * Process weekly points for all users, respecting their timezones
   */
  @TryCatchAsync()
  async processWeeklyPointsForAllTimezones(): Promise<void> {
    this.logger.log("Running weekly points distribution job...");

    if (!this.timezoneGroups || this.timezoneGroups.size === 0) {
      this.logger.warn("No timezone groups found, initializing...");
      await this.setupTimezoneGroups();

      if (!this.timezoneGroups || this.timezoneGroups.size === 0) {
        this.logger.error("Failed to initialize timezone groups");
        return;
      }
    }

    // Process each timezone group
    for (const [timezone, users] of this.timezoneGroups.entries()) {
      try {
        // Check if it's Sunday in the user's timezone before processing
        const now = new Date();
        const userTime = new Date(
          now.toLocaleString("en-US", { timeZone: timezone })
        );

        // Only process if it's Sunday (day 0) in the user's timezone
        if (userTime.getDay() === 0) {
          this.logger.log(
            `Processing users in timezone: ${timezone} (${users.length} users)`
          );
          await this.processUsersInTimezone(users, timezone);
        } else {
          this.logger.log(
            `Skipping users in timezone: ${timezone} as it's not Sunday there yet (day: ${userTime.getDay()})`
          );
        }
      } catch (error) {
        this.logger.error(
          `Error processing timezone ${timezone}:`,
          error instanceof Error ? error.message : String(error)
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
  private async processUsersInTimezone(
    users: UserWithTimezone[],
    timezone: string
  ): Promise<void> {
    this.logger.log(
      `Processing weekly points for ${users.length} users in timezone: ${timezone}`
    );

    try {
      // Get weekly points data ahead of time
      const weeklyPointsData = await this.pointsSystemService.getWeeklyPoints();

      // Calculate start of previous week for this timezone
      const now = new Date();
      const lastWeekStart = new Date(now);
      lastWeekStart.setDate(now.getDate() - 7);

      // Track results
      const results = { success: 0, failed: 0 };
      const MAX_RETRIES = 3;
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
            this.processUserPoints(
              req.user,
              req.address,
              weeklyPointsData,
              results,
              MAX_RETRIES
            )
          )
        );
      }

      this.logger.log(
        `Weekly points processing complete for timezone ${timezone}. Success: ${results.success}, Failed: ${results.failed}`
      );
    } catch (error) {
      this.logger.error(
        `Error processing weekly points for timezone ${timezone}:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Sets up timezone grouping for processing users according to their timezones
   */
  @TryCatchAsync()
  async setupTimezoneGroups(): Promise<void> {
    this.logger.log("Setting up timezone groups...");

    // Get all users and their timezones using BotService
    const users = await this.botService.getAllUsers();

    if (!users || users.length === 0) {
      this.logger.warn("No users found for timezone groups");
      return;
    }

    // Group users by timezone
    const timezoneGroups = new Map<string, UserWithTimezone[]>();

    for (const user of users) {
      // Validate and normalize timezone
      let userTimezone = user.timezone || "UTC";

      // If the timezone is not supported, default to UTC
      if (!SUPPORTED_TIMEZONES.has(userTimezone)) {
        this.logger.warn(
          `Unsupported timezone ${userTimezone} for user ${user.username}, defaulting to UTC`
        );
        userTimezone = "UTC";
      }

      // Save user timezone for future reference
      for (const address of user.addresses) {
        this.userTimezones.set(address, userTimezone);
      }

      if (!timezoneGroups.has(userTimezone)) {
        timezoneGroups.set(userTimezone, []);
      }
      timezoneGroups.get(userTimezone)?.push({
        ...user,
        timezone: userTimezone, // Ensure normalized timezone
      });
    }

    this.logger.log(
      `Found ${timezoneGroups.size} different timezones among users`
    );

    // Log timezone distribution for monitoring
    for (const [timezone, usersInTimezone] of timezoneGroups.entries()) {
      this.logger.log(`Timezone ${timezone}: ${usersInTimezone.length} users`);
    }

    // Store timezone groups
    this.timezoneGroups = timezoneGroups;
  }

  /**
   * Process and send points for a single user address with retry logic
   */
  private async processUserPoints(
    user: UserWithTimezone,
    address: string,
    weeklyPoints: Record<string, string>,
    results: { success: number; failed: number },
    maxRetries: number
  ): Promise<void> {
    try {
      // Find points for this address or assign default
      const userPoints = weeklyPoints[address] || "0";

      // Get user's last processed date or set to one week ago if not found
      const now = new Date();
      const lastProcessedDate =
        this.lastProcessedDate.get(address) ||
        new Date(now.setDate(now.getDate() - 7));

      // Save current date as last processed for next time
      this.lastProcessedDate.set(address, new Date());

      // Send weekly points event using BotService
      await this.botService.sendWeeklyPointsEvent(
        address,
        userPoints.toString(),
        "points",
        {
          timezone: user.timezone,
          lastProcessedAt: lastProcessedDate.toISOString(),
        }
      );

      results.success++;
      this.logger.log(
        `Points sent for ${user.username}:${address} in timezone ${user.timezone || "UTC"}`
      );
    } catch (error: unknown) {
      results.failed++;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to send points for ${user.username}:${address}: ${errorMessage}`
      );
    }
  }
}
