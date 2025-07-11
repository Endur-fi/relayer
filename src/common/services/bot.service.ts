import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

import { EventType, TryCatchAsync } from "../utils";

interface WebhookEventData {
  message: string;
  eventType: EventType;
  starknetAddress: string;
  token: string;
  metadata?: string;
}

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);
  private readonly BOT_API_BASE_URL =
    process.env.BOT_API_BASE_URL || "http://localhost:3000";
  private readonly BOT_SECRET_KEY = process.env.BOT_SECRET_KEY || "";

  /**
   * Send webhook event to bot with retry logic
   */
  @TryCatchAsync()
  async sendWebhookEvent(
    eventData: WebhookEventData,
    maxRetries = 3
  ): Promise<void> {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await axios.post(`${this.BOT_API_BASE_URL}/webhook`, eventData, {
          headers: {
            "x-secret-key": this.BOT_SECRET_KEY,
          },
        });

        this.logger.log(
          `Webhook sent successfully: ${eventData.eventType} for ${eventData.starknetAddress}`
        );
        return;
      } catch (error: unknown) {
        retries++;
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (retries >= maxRetries) {
          this.logger.error(
            `Failed to send webhook ${eventData.eventType} after ${maxRetries} retries: ${errorMessage}`
          );
          throw error;
        }

        this.logger.warn(
          `Retrying webhook (${retries}/${maxRetries}) for ${eventData.eventType}`
        );

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, retries))
        );
      }
    }
  }

  /**
   * Send xSTRK unstaking initiation event
   */
  @TryCatchAsync()
  async sendUnstakeInitiationEvent(
    message: string,
    starknetAddress: string,
    token: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.sendWebhookEvent({
      message,
      eventType: "strk_unstake_initiated_lst",
      starknetAddress,
      token,
      metadata: JSON.stringify(metadata),
    });
  }

  /**
   * Send xSTRK unstaking completion event
   */
  @TryCatchAsync()
  async sendUnstakeCompletionEvent(
    message: string,
    starknetAddress: string,
    token: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.sendWebhookEvent({
      message,
      eventType: "strk_unstake_completed_lst",
      starknetAddress,
      token,
      metadata: JSON.stringify(metadata),
    });
  }

  /**
   * Send weekly points earned event
   */
  @TryCatchAsync()
  async sendWeeklyPointsEvent(
    message: string,
    starknetAddress: string,
    token: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.sendWebhookEvent({
      message,
      eventType: "endur_points_earned_weekly_lst",
      starknetAddress,
      token,
      metadata: JSON.stringify(metadata),
    });
  }

  /**
   * Get user information from bot API
   */
  @TryCatchAsync()
  async getUserByAddress(starknetAddress: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.BOT_API_BASE_URL}/api/users/by-address/${starknetAddress}`,
        {
          headers: {
            "x-secret-key": this.BOT_SECRET_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.logger.warn(`User not found for address ${starknetAddress}`);
      return null;
    }
  }

  /**
   * Get all users with pagination
   */
  @TryCatchAsync()
  async getAllUsers(): Promise<any[]> {
    const allUsers: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      try {
        const response = await axios.get(
          `${this.BOT_API_BASE_URL}/api/users?limit=${limit}&offset=${offset}`,
          {
            headers: {
              "x-secret-key": this.BOT_SECRET_KEY,
            },
          }
        );

        const users = response.data.users;

        if (!users || users.length === 0) {
          hasMoreUsers = false;
          continue;
        }

        allUsers.push(...users);
        offset += limit;

        if (users.length < limit) {
          hasMoreUsers = false;
        }
      } catch (error) {
        this.logger.error(
          "Error fetching users:",
          error instanceof Error ? error.message : String(error)
        );
        throw error;
      }
    }

    return allUsers;
  }
}
