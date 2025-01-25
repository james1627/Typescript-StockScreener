import { Stock } from '~/common/Stock';

export interface IStockRetrieverService {
  GetQuote(ticker: string): Promise<Stock | undefined>;
  GetQuotes(tickers: string[]): Promise<(Stock | undefined)[]>;
}
