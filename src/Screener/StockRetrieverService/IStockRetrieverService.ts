import { Stock } from '~/Common/Stock';
import { Option } from '~/Common/Option';

export default interface IStockRetrieverService {
  GetQuote(ticker: string): Promise<Stock | undefined>;
  GetQuotes(tickers: string[]): Promise<(Stock | undefined)[]>;
  GetOptionQuotes(tickers: string[]): Promise<(Option | undefined)[]>;
}
