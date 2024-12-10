import { Injectable, Logger } from "@nestjs/common";
import { TelegramNotif } from '@strkfarm/sdk';
import { ConfigService } from "./configService";

interface INotifService {
  sendMessage(msg: string): void;
}

@Injectable()
export class NotifService implements INotifService {
  readonly logger = new Logger(NotifService.name);
  readonly telegram: TelegramNotif | null = null;
  readonly config: ConfigService;

  constructor(config: ConfigService) {
    const tgToken = config.get("tgToken");
    if (tgToken) {
      this.telegram = new TelegramNotif(tgToken, false);
    }
    this.config = config;
  }

  sendMessage(msg: string): void {
    this.logger.debug(`TG Message: ${msg}`);
    if (this.telegram) {
      this.telegram.sendMessage(msg);
    }
  }
}