import { Stock } from '~/Common/Stock';

export interface IStockRepository {
  storeStocks(stocks: Stock[]): Promise<Stock[]>;
  getStoredStocks(): Promise<Stock[]>;
}
