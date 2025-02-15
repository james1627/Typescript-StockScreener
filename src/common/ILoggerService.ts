export const logLevels = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR',
  none: 'NONE',
} as const;

export type LogLevel = (typeof logLevels)[keyof typeof logLevels];

export function mapToLogLevel(level: string): LogLevel | undefined {
  return Object.entries(logLevels).find(([key]) => key === level)?.[1];
}

export interface ILoggerService {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  info(message: string): void;
}
