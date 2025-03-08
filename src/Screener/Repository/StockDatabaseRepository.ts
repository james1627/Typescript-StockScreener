import { Stock } from '~/Common/Stock';
import { IStockRepository } from './IStockRepository';
import IDatabaseProvider from '~/Common/Database/IDatabaseProvider';

export type StockDatabaseRepositoryProps = {
  databaseProvider: IDatabaseProvider;
};

export default class StockDatabaseRepository implements IStockRepository {
  private readonly databaseProvider: IDatabaseProvider;
  private readonly CHUNK_SIZE = 1000;
  private readonly COLUMNS = 26;

  constructor({ databaseProvider }: StockDatabaseRepositoryProps) {
    this.databaseProvider = databaseProvider;
  }

  private static generatePlaceholderSequence(
    length: number,
    totalInserts: number,
  ): string {
    const placeholders: string[] = [];

    for (let i1 = 0; i1 < totalInserts; i1++) {
      placeholders.push(
        `(${Array.from({ length }, (_, i) => `\$${i1 * length + i + 1}`).join(', ')})`,
      );
    }

    return placeholders.join(', ');
  }

  async storeStocks(stocks: Stock[]): Promise<Stock[]> {
    await this.ensureTableExists();

    const placeholders = StockDatabaseRepository.generatePlaceholderSequence(
      this.COLUMNS,
      this.CHUNK_SIZE,
    );

    // Join all placeholders for the multi-row insert
    const queryTemplate = `
      INSERT INTO stocks (exchange, ticker, price, name, type, beta, pe, eps, ptb, book, divRate, divYield, marketCap, volume, avgVolume, highPrice, lowPrice, openPrice, f2weekHigh, f2weekLow, fDayAvg, fDayAvgChange, tooDayAvg, ops, rating, optionable)
      VALUES ${placeholders};
    `;

    const values: any[] = stocks
      .map((stock) => [
        stock.exchange,
        stock.ticker,
        stock.price,
        stock.name,
        stock.type,
        stock.beta,
        stock.pe,
        stock.eps,
        stock.ptb,
        stock.book,
        stock.divRate,
        stock.divYield,
        stock.marketCap,
        stock.volume,
        stock.avgVolume,
        stock.highPrice,
        stock.lowPrice,
        stock.openPrice,
        stock.f2weekHigh,
        stock.f2weekLow,
        stock.fDayAvg,
        stock.fDayAvgChange,
        stock.tooDayAvg,
        stock.ops,
        stock.rating,
        stock.optionable,
      ])
      .flat();

    const chunk = this.COLUMNS * this.CHUNK_SIZE;
    const chunkedValues = Array.from(
      { length: Math.ceil(values.length / chunk) },
      (_, index) => values.slice(index * chunk, (index + 1) * chunk),
    );

    // Execute the query for each chunk using map and Promise.all
    await Promise.all(
      chunkedValues.map(async (chunk, index) => {
        // If this is the last chunk, adjust the number of placeholders
        const currentChunkSize = chunk.length / this.COLUMNS;
        const lastChunkPlaceholders =
          index === chunkedValues.length - 1
            ? StockDatabaseRepository.generatePlaceholderSequence(
                this.COLUMNS,
                currentChunkSize,
              )
            : placeholders;

        // Create the final query for this chunk with the adjusted placeholders
        const query = queryTemplate.replace(
          placeholders,
          lastChunkPlaceholders,
        );

        // Execute the query for the current chunk
        return this.databaseProvider.query(query, chunk);
      }),
    );

    return stocks;
  }

  async getStoredStocks(): Promise<Stock[]> {
    await this.ensureTableExists();

    const stocks: Stock[] = await this.databaseProvider.query<Stock>(
      'SELECT * FROM stocks ORDER BY ticker DESC',
    );

    return stocks;
  }

  async ensureTableExists(): Promise<void> {
    await this.databaseProvider.query(`
      CREATE TABLE IF NOT EXISTS stocks (
          id SERIAL PRIMARY KEY,
          exchange VARCHAR(30) NOT NULL,
          ticker VARCHAR(10) UNIQUE NOT NULL,
          price real NOT NULL,
          name VARCHAR(200) NOT NULL,
          type VARCHAR(20) NOT NULL,
          beta real,
          pe real,
          eps real,
          ptb real,
          book real,
          divRate real,
          divYield real,
          marketCap bigint,
          volume bigint,
          avgVolume bigint,
          highPrice real,
          lowPrice real,
          openPrice real,
          f2weekHigh real,
          f2weekLow real,
          fDayAvg real,
          fDayAvgChange real,
          tooDayAvg real,
          ops real,
          rating real,
          optionable boolean,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  }
}
