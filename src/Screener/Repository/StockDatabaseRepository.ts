import { Stock } from '~/Common/Stock';
import { IStockRepository } from './IStockRepository';
import IDatabaseProvider from '~/Common/Database/IDatabaseProvider';

export type StockDatabaseRepositoryProps = {
  databaseProvider: IDatabaseProvider;
};

export default class StockDatabaseRepository implements IStockRepository {
  private readonly databaseProvider: IDatabaseProvider;

  constructor({ databaseProvider }: StockDatabaseRepositoryProps) {
    this.databaseProvider = databaseProvider;
  }

  async storeStocks(stocks: Stock[]): Promise<Stock[]> {
    await this.ensureTableExists();
    const values: any[] = [];
    const placeholders: string[] = [];

    stocks.forEach((stock, index) => {
      // For each stock, create the placeholder pattern and push values into the array
      const i = index * 5; // Calculate the correct offset for each stock
      placeholders.push(
        `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5})`,
      );
      values.push(stock.ticker, stock.price, stock.beta, stock.pe, stock.eps);
    });

    // Join all placeholders for the multi-row insert
    const query = `
      INSERT INTO stocks (ticker, price, beta, pe, eps)
      VALUES ${placeholders.join(', ')};
    `;
    await this.databaseProvider.query(query, values);

    return stocks;
  }

  async getStoredStocks(): Promise<Stock[]> {
    await this.ensureTableExists();

    const stocks: Stock[] = await this.databaseProvider.query<Stock>(
      'SELECT * FROM stocks',
    );

    return stocks;
  }

  async ensureTableExists(): Promise<void> {
    await this.databaseProvider.query(`
      CREATE TABLE IF NOT EXISTS stocks (
          id SERIAL PRIMARY KEY,
          ticker VARCHAR(10) NOT NULL,
          price real NOT NULL,
          beta real,
          pe real,
          eps real,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }
}
