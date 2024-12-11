import { stock } from "../common/stock";

export interface IStockRetrieverService {
    GetQuote(ticker: string): Promise<stock | undefined>;
    GetQuotes(tickers: string[]): Promise<(stock | undefined)[]>;
}