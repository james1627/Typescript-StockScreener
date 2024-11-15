import { ILoggerService } from "../common/ILoggerService";
import { stock } from "../common/stock";
import { IStockRetrieverService } from "./IStockRetrieverService";
import yahooFinance from 'yahoo-finance2';

export type StockRetrieverServiceArgs {
    logger: ILoggerService
};

export default class StockRetrieverService implements IStockRetrieverService {
    private readonly logger: ILoggerService;

    constructor({logger}: StockRetrieverServiceArgs) {
        this.logger = logger;
    }
    async GetQuote(ticker: string): Promise<stock | undefined> {
        try {
            const quote = await yahooFinance.quote(ticker)
            const price = quote.regularMarketPrice ?? quote.postMarketPrice ?? quote.ask;
            if(!price) {
                throw Error(`No Price Found for '${ticker}'`);
            }
            return {
                ticker,
                price
            };
        } catch {
            this.logger.error(`Ticker '${ticker}' not found`);
        }
        return;
    }

};