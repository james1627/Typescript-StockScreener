import { ILoggerService } from '~/Common/ILoggerService';
import { Stock } from '~/Common/Stock';
import IStockRetrieverService from './IStockRetrieverService';
import yahooFinance from 'yahoo-finance2';
import { ExponentialBackoff, handleAll, retry } from 'cockatiel';
import pLimit from 'p-limit';

yahooFinance.suppressNotices(['yahooSurvey']);

export type StockRetrieverServiceArgs = {
  logger: ILoggerService;
};

export type QuickQuote = {
  quoteType: string;
  symbol: string;
  postMarketPrice?: number;
  ask?: number;
  regularMarketPrice?: number;
  epsCurrentYear?: number;
  beta?: number;
  forwardPE?: number;
  displayName?: string;
  exchange: string;
  priceToBook?: number;
  regularMarketVolume?: number;
  averageDailyVolume3Month?: number;
  regularMarketDayLow?: number;
  regularMarketDayHigh?: number;
  regularMarketOpen?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  fiftyDayAverage?: number;
  fiftyDayAverageChangePercent?: number;
  twoHundredDayAverage?: number;
  marketCap?: number;
  trailingAnnualDividendRate?: number;
  trailingAnnualDividendYield?: number;
  averageAnalystRating?: string;
};

const quickQuoteKeys = Array<keyof QuickQuote>(
  'quoteType',
  'symbol',
  'postMarketPrice',
  'ask',
  'regularMarketPrice',
  'epsCurrentYear',
  'beta',
  'forwardPE',
  'displayName',
  'exchange',
  'priceToBook',
  'regularMarketVolume',
  'averageDailyVolume3Month',
  'regularMarketDayLow',
  'regularMarketDayHigh',
  'regularMarketOpen',
  'fiftyTwoWeekHigh',
  'fiftyTwoWeekLow',
  'fiftyDayAverage',
  'fiftyDayAverageChangePercent',
  'twoHundredDayAverage',
  'marketCap',
  'trailingAnnualDividendRate',
  'trailingAnnualDividendYield',
  'averageAnalystRating',
);

function mapQuickToStock(quote: QuickQuote): Stock {
  return {
    ticker: quote.symbol,
    type: quote.quoteType,
    price: quote.regularMarketPrice ?? quote.postMarketPrice ?? quote.ask ?? 0,
    eps: quote.epsCurrentYear,
    pe: quote.forwardPE,
    beta: quote.beta,
    name: quote.displayName ?? 'No Name',
    exchange: quote.exchange,
    ptb: quote.priceToBook,
    volume: quote.regularMarketVolume,
    avgVolume: quote.averageDailyVolume3Month,
    lowPrice: quote.regularMarketDayLow,
    highPrice: quote.regularMarketDayHigh,
    openPrice: quote.regularMarketOpen,
    f2weekHigh: quote.fiftyTwoWeekHigh,
    f2weekLow: quote.fiftyTwoWeekLow,
    fDayAvg: quote.fiftyDayAverage,
    fDayAvgChange: quote.fiftyDayAverageChangePercent,
    tooDayAvg: quote.twoHundredDayAverage,
    marketCap: quote.marketCap,
    divRate: quote.trailingAnnualDividendRate,
    divYield: quote.trailingAnnualDividendYield,
    rating: parseInt(quote.averageAnalystRating!) ?? undefined,
  };
}

export default class StockRetrieverService implements IStockRetrieverService {
  private static readonly limit = pLimit(10);
  private readonly logger: ILoggerService;

  constructor({ logger }: StockRetrieverServiceArgs) {
    this.logger = logger;
  }

  async GetQuote(ticker: string): Promise<Stock | undefined> {
    try {
      console.log(quickQuoteKeys);
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
