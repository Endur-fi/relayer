// The relayer's jobs in the order run-once.ts runs them, and when each is due.
// Kept free of service imports so it can be checked without the relayer's env.
export const JOB_ORDER = [
  "claim-rewards",
  "swap-rewards",
  "send-stats",
  "unstake-intents",
  "process-withdraw-queue",
  "stake-funds",
] as const;

export type JobName = (typeof JOB_ORDER)[number];

// Mainnet schedules from cron.service.ts, by UTC hour
export function jobsDueAt(hour: number): JobName[] {
  return JOB_ORDER.filter((job) => {
    switch (job) {
      case "claim-rewards":
      case "send-stats":
        return hour % 6 === 0;
      case "unstake-intents":
      case "stake-funds":
        return hour % 12 === 0;
      default:
        return true;
    }
  });
}

export function parseJobs(list: string): JobName[] {
  const names = list.split(",").map((j) => j.trim());
  const unknown = names.filter(
    (j) => !(JOB_ORDER as readonly string[]).includes(j)
  );
  if (unknown.length) {
    throw new Error(
      `Unknown job(s): ${unknown.join(", ")}. Known: ${JOB_ORDER.join(", ")}`
    );
  }
  return JOB_ORDER.filter((j) => names.includes(j));
}
