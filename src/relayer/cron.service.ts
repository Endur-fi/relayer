import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WithdrawalQueueService } from "./services/withdrawalQueueService.ts";
import { ConfigService } from "./services/configService.ts";
import { PrismaService } from "./services/prismaService.ts";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  readonly config: ConfigService;
  readonly withdrawalQueueService: WithdrawalQueueService;
  readonly prismaService: PrismaService;

  constructor(
    config: ConfigService,
    withdrawalQueueService: WithdrawalQueueService,
    prismaService: PrismaService,
  ) {
    this.config = config;
    this.withdrawalQueueService = withdrawalQueueService;
    this.prismaService = prismaService;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  processWithdrawQueue() {
    this.logger.debug('running processWithdrawQueue task');
    
    // get pending withdrawals
    const pendingWithdrawals = this.prismaService.getPendingWithdrawals(BigInt(10 ** 16));
    this.logger.debug(`Found ${pendingWithdrawals.length} pending withdrawals`);
  }
}