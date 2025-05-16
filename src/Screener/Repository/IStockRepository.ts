import { Stock } from '~/Common/stock';

export interface IStockRepository {
  storeStocks(stocks: Stock[]): Promise<Stock[]>;
  getStoredStocks(): Promise<Stock[]>;
}
