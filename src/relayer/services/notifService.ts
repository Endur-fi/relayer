import { Injectable, Logger } from "@nestjs/common";
import { TelegramNotif } from '@strkfarm/sdk';
import { ConfigService } from "./configService.ts";

interface INotifService {
  sendMessage(msg: string): void;
}

@Injectable()
export class NotifService implements INotifService {
  private readonly logger = new Logger(NotifService.name);
  private readonly telegram: TelegramNotif | null = null;

  constructor(config: ConfigService) {
    const tgToken = config.get("tgToken");
    if (tgToken) {
      this.telegram = new TelegramNotif(tgToken, false);
    }
  }

  sendMessage(msg: string): void {
    this.logger.debug(`TG Message: ${msg}`);
    if (this.telegram) {
      this.telegram.sendMessage(msg);
    }
  }
}