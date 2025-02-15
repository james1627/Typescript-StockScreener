import dotenv from 'dotenv';
import { LogLevel, mapToLogLevel } from './Common/ILoggerService';
import path from 'path';

export default class ScreenerConfig {
  readonly databaseConnectionString: string | undefined;

  readonly port: number;

  readonly logLevel: LogLevel | undefined;

  readonly basePath = path.resolve(__dirname, '.');

  constructor() {
    dotenv.config({ path: `${this.basePath}/.env` });

    this.databaseConnectionString = process.env.DatabaseConnectionString;

    this.port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    this.logLevel = process.env.LOG_LEVEL
      ? mapToLogLevel(process.env.LOG_LEVEL)
      : undefined;
  }
}
