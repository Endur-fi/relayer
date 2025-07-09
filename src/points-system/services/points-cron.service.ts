import { DexScoreService } from "./dex-points.service";
import { PointsSystemService } from "./points-system.service";
import { WeeklyPointsService } from "./weekly-points.service";

import { getDate } from "../utils";

export class PointsCronService {
  constructor(
    private readonly dexScoreService: DexScoreService,
    private readonly pointsSystemService: PointsSystemService,
    private readonly weeklyPointsService: WeeklyPointsService
  ) {}

  // Run the same task on startup
  async onModuleInit() {
    console.log("Running task on application start...");

    // configure points system
    this.pointsSystemService.setConfig({
      startDate: getDate("2024-11-25"),
      endDate: getDate(),
    });

    await this.init();

    // Set up timezone-based scheduled jobs
    await this.weeklyPointsService.setupTimezoneGroups();
  }

  async init() {
    try {
      // maintains prices for DEX points calc
      await this.dexScoreService.saveCurrentPrices();

      // allocates points based on holdings
      await this.pointsSystemService.fetchAndStoreHoldings();

      // computes points based on DEX bonus scores
      await this.dexScoreService.saveBonusPoints();
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  }
}
