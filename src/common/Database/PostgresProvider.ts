import { Client } from 'pg';
import IDatabaseProvider from './IDatabaseProvider';

export class PostgresProvider implements IDatabaseProvider {
  private client: Client;

  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.end();
  }

  async query<T>(text: string, params?: unknown[]): Promise<T[]> {
    const res = await this.client.query(text, params);
    return res.rows;
  }
}
