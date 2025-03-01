import { ILoggerService } from '~/Common/ILoggerService';
import { Stock } from '~/Common/Stock';
import { Option } from '~/Common/Option';
import IStockRetrieverService from './IStockRetrieverService';
import yahooFinance from 'yahoo-finance2';
import { ExponentialBackoff, handleAll, retry } from 'cockatiel';
import pLimit from 'p-limit';
import { mapQuickToStock, QuickQuote, quickQuoteKeys } from './QuickQuote';
import {
  mapQuickToOption,
  quickOptionQuoteKeys,
  QuickOptionQuote,
} from './QuickOptionQuote';

yahooFinance.suppressNotices(['yahooSurvey']);

export type StockRetrieverServiceArgs = {
  logger: ILoggerService;
};

export default class StockRetrieverService implements IStockRetrieverService {
  private static readonly limit = pLimit(10);
  private readonly logger: ILoggerService;

  constructor({ logger }: StockRetrieverServiceArgs) {
    this.logger = logger;
  }

  async GetQuote(ticker: string): Promise<Stock | undefined> {
    try {
      const quote: QuickQuote = await yahooFinance.quote(ticker);
      const stock = mapQuickToStock(quote);
      if (stock.price === 0) {
        throw Error(`No Price Found for '${ticker}'`);
      }
      return stock;
    } catch {
      this.logger.error(`Ticker '${ticker}' not found`);
    }
    return;
  }

  async GetQuotes(tickers: string[]): Promise<(Stock | undefined)[]> {
    const retryPolicy = retry(handleAll, {
      maxAttempts: 3,
      backoff: new ExponentialBackoff(),
    });

    try {
      const quotes: QuickQuote[] = await StockRetrieverService.limit(async () =>
        retryPolicy.execute(async () => {
          return yahooFinance.quote(
            tickers,
            {
              fields: quickQuoteKeys,
            },
            { validateResult: false },
          );
        }),
      );

      return quotes.map((quote) => {
        const stock = mapQuickToStock(quote);
        if (stock.price !== 0) {
          return stock;
        }
        return;
      });
    } catch {
      console.error(`Failed for these ${tickers}`);
      return [undefined];
    }
  }

  async GetOptionQuotes(tickers: string[]): Promise<(Option | undefined)[]> {
    const retryPolicy = retry(handleAll, {
      maxAttempts: 3,
      backoff: new ExponentialBackoff(),
    });

    try {
      const quotes: QuickOptionQuote[] = await StockRetrieverService.limit(
        async () =>
          retryPolicy.execute(async () => {
            return yahooFinance.quote(
              tickers,
              {
                fields: quickOptionQuoteKeys,
              },
              { validateResult: false },
            );
          }),
      );

      return quotes.map((quote) => {
        const stock = mapQuickToOption(quote);
        if (stock.price !== 0) {
          return stock;
        }
        return;
      });
    } catch {
      console.error(`Failed for these ${tickers}`);
      return [undefined];
    }
  }
}

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
