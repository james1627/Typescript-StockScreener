import { Stock } from '~/Common/Stock';

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

export const quickQuoteKeys = Array<keyof QuickQuote>(
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

export function mapQuickToStock(quote: QuickQuote): Stock {
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
