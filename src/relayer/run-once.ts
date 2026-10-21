/**
 * Runs the relayer's jobs once and exits. Meant for an hourly cron
 * (Render: "5 * * * *", UTC) instead of keeping main.ts running all day.
 *
 * Which jobs run is decided from the UTC hour, matching the mainnet
 * schedules in cron.service.ts:
 *   every hour     swap rewards, process withdraw queue
 *   every 6 hours  claim rewards, send stats
 *   every 12 hours handle unstake intents, stake funds
 * Swapping straight after the claim replaces the old 5-minute swap: rewards
 * only arrive when they are claimed, so the other runs found nothing to swap.
 *
 * Jobs run one after another, in the order below, because they share one
 * account and concurrent transactions from it can collide on the nonce.
 *
 * Usage:
 *   npx tsx src/relayer/run-once.ts                     # jobs due this hour
 *   npx tsx src/relayer/run-once.ts --jobs claim-rewards,swap-rewards
 *   npx tsx src/relayer/run-once.ts --hour 12 --plan    # print, run nothing
 */
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
dotenv.config();

import { CronService } from "./cron.service";
import { JobName, jobsDueAt, parseJobs } from "./jobs";
import { RELAYER_PROVIDERS } from "./providers";

const JOBS: Record<JobName, (s: CronService) => Promise<unknown>> = {
  "claim-rewards": (s) => s.claimRewards(),
  "swap-rewards": (s) => s.swapRewardsToUnderlyingToken(),
  "send-stats": (s) => s.sendStats(),
  "unstake-intents": (s) => s.handleUnstakeIntents(),
  "process-withdraw-queue": (s) => s.processWithdrawQueue(),
  "stake-funds": (s) => s.stakeFunds(),
};

// Telegram alerts are sent without being awaited; give them time to leave
const FLUSH_MS = 5000;

function argValue(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

function selectJobs(): JobName[] {
  const requested = argValue("--jobs");
  if (requested) return parseJobs(requested);
  const hourArg = argValue("--hour");
  const hour =
    hourArg === undefined ? new Date().getUTCHours() : Number(hourArg);
  return jobsDueAt(hour);
}

// No ScheduleModule and no HTTP controller: the @Cron decorators stay inert
@Module({ providers: RELAYER_PROVIDERS })
class RunOnceModule {}

async function main(): Promise<number> {
  const jobs = selectJobs();
  console.log(`Jobs: ${jobs.join(", ")}`);
  if (process.argv.includes("--plan")) return 0;

  // init() runs onModuleInit, which loads validators and the arb contract
  const app = await NestFactory.createApplicationContext(RunOnceModule);
  const cron = app.get(CronService);

  const failed: JobName[] = [];
  for (const job of jobs) {
    const started = Date.now();
    try {
      await JOBS[job](cron);
      console.log(
        `[${job}] done in ${Math.round((Date.now() - started) / 1000)}s`
      );
    } catch (err) {
      // TryCatchAsync has already logged it and alerted Telegram
      console.error(`[${job}] failed:`, err);
      failed.push(job);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, FLUSH_MS));
  await app.close();

  if (failed.length) {
    console.error(`Failed jobs: ${failed.join(", ")}`);
    return 1;
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error("run-once crashed:", err);
    process.exit(1);
  });
