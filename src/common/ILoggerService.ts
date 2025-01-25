export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'NONE';

export interface ILoggerService {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  info(message: string): void;
}
