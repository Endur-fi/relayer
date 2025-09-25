import { metrics, logger } from "./monitoring";

type Labels = Record<string, string>;

const pendingRequestsCount = metrics.createGauge(
  "relayer_pending_requests_count",
  "Total number of pending withdrawal requests",
  ["token"]
);

const pendingRequestsAmount = metrics.createGauge(
  "relayer_pending_requests_amount",
  "Total pending withdrawal amount (token units)",
  ["token"]
);

const pendingMaxRequestPendingHours = metrics.createGauge(
  "relayer_pending_max_request_pending_hours",
  "Max pending time of the oldest request in hours",
  ["token"]
);

const rewardsClaimedTotal = metrics.createCounter(
  "relayer_rewards_claimed_total",
  "Total times rewards were claimed successfully",
  ["token", "validator"]
);

const stakeActionsTotal = metrics.createCounter(
  "relayer_stake_actions_total",
  "Total stake actions executed",
  ["token", "validator", "is_assigned"]
);

const stakeAmountHistogram = metrics.createHistogram(
  "relayer_stake_amount_tokens",
  "Stake amounts per action (token units)",
  ["token", "validator", "is_assigned"],
  [0.01, 0.1, 1, 5, 10, 50, 100, 500, 1_000, 5_000, 10_000]
);

const rewardSwapActionsTotal = metrics.createCounter(
  "relayer_reward_swap_actions_total",
  "Total reward swap attempts",
  ["token", "outcome"] // outcome: swapped|skipped
);

const lastStrkBalanceForSwap = metrics.createGauge(
  "relayer_last_strk_balance_for_swap",
  "Last observed STRK balance considered for swap (token units)",
  ["token"]
);

const eligibleUnstakeAmountGauge = metrics.createGauge(
  "relayer_eligible_unstake_amount",
  "Eligible unstake amount computed (token units)",
  ["token"]
);

const unprocessedWithdrawQueueAmountGauge = metrics.createGauge(
  "relayer_unprocessed_withdraw_queue_amount",
  "Unprocessed withdraw queue amount (token units)",
  ["token"]
);

const intransitAmountGauge = metrics.createGauge(
  "relayer_intransit_amount",
  "Intransit amount (token units)",
  ["token"]
);

const totalPendingUnstakeAmountGauge = metrics.createGauge(
  "relayer_total_pending_unstake_amount",
  "Total pending unstake amount (token units)",
  ["token"]
);

const totalUnstakedIn12hrsGauge = metrics.createGauge(
  "relayer_total_unstaked_in_12hrs",
  "Total unstaked amount in last 12 hours (token units)",
  ["token"]
);

const handleUnstakeIntentsTotal = metrics.createCounter(
  "relayer_handle_unstake_intents_total",
  "Total handleUnstakeIntents outcomes",
  ["token", "outcome"] // outcome: done|skipped
);

export const RelayerMonitoring = {
  recordPendingRequests(token: string, count: number, amount: number, oldestTimestampSec?: number) {
    const labels: Labels = { token };
    pendingRequestsCount.set(labels, count);
    pendingRequestsAmount.set(labels, amount);
    if (oldestTimestampSec && oldestTimestampSec > 0) {
      const hours = Math.max(0, (Date.now() - oldestTimestampSec * 1000) / (1000 * 60 * 60));
      pendingMaxRequestPendingHours.set(labels, hours);
    } else {
      pendingMaxRequestPendingHours.set(labels, 0);
    }
  },

  recordRewardsClaimed(token: string, validator: string) {
    rewardsClaimedTotal.inc({ token, validator });
  },

  recordStakeAction(token: string, validator: string, isAssigned: boolean, amount: number) {
    const labels: Labels = { token, validator, is_assigned: String(isAssigned) };
    stakeActionsTotal.inc(labels);
    // ensure non-negative and finite
    const value = Number.isFinite(amount) && amount >= 0 ? amount : 0;
    stakeAmountHistogram.observe(labels, value);
  },

  recordRewardSwap(token: string, strkBalance: number, outcome: "swapped" | "skipped") {
    lastStrkBalanceForSwap.set({ token }, strkBalance);
    rewardSwapActionsTotal.inc({ token, outcome });
  },

  recordHandleUnstakeMetrics(token: string, params: {
    eligibleUnstakeAmount: number;
    unprocessedWithdrawQueueAmount: number;
    intransitAmount: number;
    totalPendingUnstakeAmount: number;
    totalUnstakedIn12hrs: number;
    outcome: "done" | "skipped";
  }) {
    const labels: Labels = { token };
    eligibleUnstakeAmountGauge.set(labels, params.eligibleUnstakeAmount);
    unprocessedWithdrawQueueAmountGauge.set(labels, params.unprocessedWithdrawQueueAmount);
    intransitAmountGauge.set(labels, params.intransitAmount);
    totalPendingUnstakeAmountGauge.set(labels, params.totalPendingUnstakeAmount);
    totalUnstakedIn12hrsGauge.set(labels, params.totalUnstakedIn12hrs);
    handleUnstakeIntentsTotal.inc({ token, outcome: params.outcome });
  },
};

export default RelayerMonitoring;


