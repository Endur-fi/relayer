import { BotService } from "../common/services/bot.service";
import { CronService } from "./cron.service";
import { ConfigService } from "./services/configService";
import { DelegatorService } from "./services/delegatorService";
import { LSTService } from "./services/lstService";
import { NotifService } from "./services/notifService";
import { PrismaService } from "./services/prismaService";
import { RPCWrapper } from "./services/RPCWrapper";
import { ValidatorRegistryService } from "./services/validatorRegistryService";
import { WithdrawalQueueService } from "./services/withdrawalQueueService";

// Shared by the long-running relayer (main.ts) and the scheduled run (run-once.ts)
export const RELAYER_PROVIDERS = [
  PrismaService,
  ConfigService,
  LSTService,
  WithdrawalQueueService,
  DelegatorService,
  NotifService,
  BotService,
  ValidatorRegistryService,
  RPCWrapper,
  CronService,
];
