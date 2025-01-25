import { tr } from 'indicatorts';
import { ILoggerService } from './ILoggerService';

type logLevel = 'INFO' | 'WARN' | 'ERROR' | 'NONE';

export type ConsoleLoggerServiceProps = {
  logLevel?: logLevel;
};

export class ConsoleLoggerService implements ILoggerService {
  private readonly logInfo: boolean = false;
  private readonly logError: boolean = false;
  private readonly logWarn: boolean = false;

  constructor({ logLevel }: ConsoleLoggerServiceProps) {
    switch (logLevel) {
      case 'INFO':
        this.logInfo = true;
      case 'WARN':
        this.logWarn = true;
      case 'ERROR':
        this.logError = true;
    }
  }

  log(message: string): void {
    if (this.logInfo) {
      console.log(`LOG: ${message}`);
    }
  }

  warn(message: string): void {
    if (this.logWarn) {
      console.warn(`WARN: ${message}`);
    }
  }

  error(message: string): void {
    if (this.logError) {
      console.error(`ERROR: ${message}`);
    }
  }

  info(message: string): void {
    if (this.logInfo) {
      console.info(`INFO: ${message}`);
    }
  }
}
