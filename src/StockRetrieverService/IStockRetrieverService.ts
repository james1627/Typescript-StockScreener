import { Stock } from '~/common/Stock';

export default interface IStockRetrieverService {
  GetQuote(ticker: string): Promise<Stock | undefined>;
  GetQuotes(tickers: string[]): Promise<(Stock | undefined)[]>;
}
