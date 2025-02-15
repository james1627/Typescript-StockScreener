export default interface IDatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(text: string, params?: unknown[]): Promise<T[]>;
}
