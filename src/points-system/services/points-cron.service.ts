import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { DexScoreService } from './dex-points.service';
import { PointsSystemService } from './points-system.service';
import { WeeklyPointsService } from './weekly-points.service';

import { TryCatchAsync } from '../../common/utils';
import { getDate, prisma } from '../utils';

@Injectable()
export class PointsCronService {
  private readonly logger = new Logger(PointsCronService.name);

  constructor(
    @Inject(DexScoreService)
    private readonly dexScoreService: DexScoreService,
    @Inject(PointsSystemService)
    private readonly pointsSystemService: PointsSystemService,
    @Inject(WeeklyPointsService)
    private readonly weeklyPointsService: WeeklyPointsService,
  ) {}

  // Run the same task on startup
  @TryCatchAsync()
  async onModuleInit() {
    this.logger.log('Running task on application start...');

    // configure points system
    this.pointsSystemService.setConfig({
      startDate: getDate('2024-11-25'),
      endDate: getDate(),
    });

    await this.init();
  }

  async init() {
    try {
      await this.dexScoreService.saveCurrentPrices();
      await this.pointsSystemService.fetchAndStoreHoldings();
    } catch (error) {
      this.logger.error('Error during initialization:', error);
    }
  }

  // Run weekly job at midnight UTC on Sunday and process all users according to their timezones
  @Cron('0 0 * * 0')
  @TryCatchAsync()
  async processWeeklyPoints() {
    this.logger.log('Running scheduled weekly points distribution job...');
    await this.weeklyPointsService.processWeeklyPointsForAllUsers();
  }
}
