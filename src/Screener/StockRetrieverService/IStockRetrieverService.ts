import { Stock } from '~/Common/Stock';

export default interface IStockRetrieverService {
  GetQuote(ticker: string): Promise<Stock | undefined>;
  GetQuotes(tickers: string[]): Promise<(Stock | undefined)[]>;
}
