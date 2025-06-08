import { Inject, Injectable, Logger } from '@nestjs/common';
import { PointsSystemService } from './points-system.service';
import { TryCatchAsync } from '../../common/utils';
import { DexScoreService } from './dex-points.service';

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
    const now = new Date();
    now.setDate(now.getDate() - 1); // run until previous date
    this.pointsSystemService.setConfig({
      startDate: new Date('2024-11-25'),
      endDate: new Date('2025-05-25'),
    });

    this.pointsSystemService.setConfig({
      startDate: new Date('2025-06-07'),
      endDate: new Date(),
    });

    // await this.dexScoreService.saveCurrentPrices();
    await this.pointsSystemService.fetchAndStoreHoldings();
    await this.dexScoreService.saveBonusPoints();
  }
}
