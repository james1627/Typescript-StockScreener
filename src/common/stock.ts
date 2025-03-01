export type BasicStock = {
  ticker: string;
  price: number;
};

export type Stock = BasicStock & {
  exchange: string;
  type: string;
  name: string;
  beta?: number;
  pe?: number;
  ptb?: number;
  eps?: number;
  book?: number;
  divRate?: number;
  divYield?: number;
  marketCap?: number;
  volume?: number;
  avgVolume?: number;
  highPrice?: number;
  lowPrice?: number;
  openPrice?: number;
  f2weekHigh?: number;
  f2weekLow?: number;
  fDayAvg?: number;
  fDayAvgChange?: number;
  tooDayAvg?: number;
  rating?: number;
  optionable?: boolean;
  ops?: number;
};
