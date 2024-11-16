import { ILoggerService } from './ILoggerService';

export class ConsoleLoggerService implements ILoggerService {
  log(message: string): void {
    console.log(`LOG: ${message}`);
  }

  warn(message: string): void {
    console.warn(`WARN: ${message}`);
  }

  error(message: string): void {
    console.error(`ERROR: ${message}`);
  }

  info(message: string): void {
    console.info(`INFO: ${message}`);
  }
}