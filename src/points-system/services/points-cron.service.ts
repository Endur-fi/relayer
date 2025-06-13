import { Inject, Injectable, Logger } from '@nestjs/common';
import { PointsSystemService } from './points-system.service';
import { TryCatchAsync } from '../../common/utils';
import { DexScoreService } from './dex-points.service';
import { getDate } from '../utils';

@Injectable()
export class PointsCronService {
  private readonly logger = new Logger(PointsCronService.name);

  constructor(
    @Inject(DexScoreService)
    private readonly dexScoreService: DexScoreService,
    @Inject(PointsSystemService)
    private readonly pointsSystemService: PointsSystemService
  ) {}

  // Run the same task on startup
  @TryCatchAsync()
  async onModuleInit() {
    console.log('Running task on application start...');

    // configure cron at 12am
    this.pointsSystemService.setConfig({
      startDate: getDate('2024-11-25'),
      endDate: getDate(),
    });

    this.init();
  }

  async init() {
    try {
      await this.dexScoreService.saveCurrentPrices();
      await this.pointsSystemService.fetchAndStoreHoldings();
    } catch(error) {
      this.logger.error('Error during initialization:', error);
    }
    // await this.dexScoreService.saveBonusPoints();
  }
}
