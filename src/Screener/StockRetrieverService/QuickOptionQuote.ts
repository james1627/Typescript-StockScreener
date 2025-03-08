import { Option } from '~/Common/Option';

export type QuickOptionQuote = {
  quoteType: string;
  symbol: string;
  ask?: number;
  bid?: number;
  regularMarketPrice?: number;
  displayName?: string;
  regularMarketVolume?: number;
  shortName?: string;
};

export const quickOptionQuoteKeys = Array<keyof QuickOptionQuote>(
  'quoteType',
  'symbol',
  'ask',
  'bid',
  'regularMarketPrice',
  'regularMarketVolume',
  'shortName',
);

export function mapQuickToOption(quote: QuickOptionQuote): Option {
  return {
    ticker: quote.symbol,
    price: quote.regularMarketPrice ?? quote.bid ?? 0,
    bid: quote.bid,
    ask: quote.ask,
    volume: quote.regularMarketVolume,
    displayName: quote.shortName ?? 'No Name',
  };
}
