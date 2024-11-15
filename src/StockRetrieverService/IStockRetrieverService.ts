import { stock } from "../common/stock";

export interface IStockRetrieverService {
    GetQuote(ticker: string): stock;
}