import { Stock } from '~/Common/Stock';

export type filterOptions = {
  priceMin?: number;
  priceMax?: number;
  betaMin?: number;
  betaMax?: number;
};

export default interface IStockSorterService {
  FilterStocks(stocks: Stock[]): Stock[];
}
