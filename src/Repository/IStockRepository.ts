import { Stock } from '~/common/Stock';

export interface IStockRepository {
  storeStocks(stocks: Stock[]): Promise<Stock[]>;
  getStoredStocks(): Promise<Stock[]>;
}
