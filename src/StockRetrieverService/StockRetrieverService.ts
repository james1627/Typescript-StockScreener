import { ILoggerService } from "../common/ILoggerService";
import { stock } from "../common/stock";
import { IStockRetrieverService } from "./IStockRetrieverService";
import yahooFinance from 'yahoo-finance2';
import { ExponentialBackoff, handleAll, retry } from "cockatiel";

export type StockRetrieverServiceArgs = {
    logger: ILoggerService
};

export type quickQuote ={
    quoteType: string,
    symbol: string,
    tradeable: boolean,
    postMarketPrice?: number,
    ask?: number,
    regularMarketPrice?: number
}

export default class StockRetrieverService implements IStockRetrieverService {
    private readonly logger: ILoggerService;

    constructor({logger}: StockRetrieverServiceArgs) {
        this.logger = logger;
    }

    async GetQuote(ticker: string): Promise<stock | undefined> {
        try {
            const quote = await yahooFinance.quote(ticker);
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

    async GetQuotes(tickers: string[]): Promise<(stock | undefined)[]> {
        const retryPolicy = retry(handleAll, {maxAttempts: 3, backoff: new ExponentialBackoff()});
        try{
            const quotes: quickQuote[] = await retryPolicy.execute(async () => {
                return yahooFinance.quote(tickers, { fields: ["symbol", "tradeable", "ask", "postMarketPrice", "regularMarketPrice"]}, {validateResult: false});
            });

            return quotes.map((quote) => {
                console.log(quote);
                const price = quote.regularMarketPrice ?? quote.postMarketPrice ?? quote.ask;
                if (quote.quoteType === "EQUITY" && price){
                    return {
                        price,
                        ticker: quote.symbol
                    };
                }
                return;
            });
        } catch {
            console.error(`Failed for these ${tickers}`);
            return [undefined];
        }
    }

};


// Define the stocks you want to analyze
// const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB'];

// // Define the start and end dates for the analysis
// const start_date = '2020-01-01';
// const end_date = '2021-01-01';


// Collect the data
// const data = {};
// for (const stock of stocks) {
//   data[stock] = yahooFinance.download(stock, start=start_date, end=end_date)['Adj Close'];
// }
// data['^GSPC'] = yahooFinance..download('^GSPC', start=start_date, end=end_date)['Adj Close'];