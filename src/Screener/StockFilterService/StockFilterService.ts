import { Stock } from '~/Common/Stock';
import IStockFilterService, { filterOptions } from './IStockFilterService';

export default class StockFilterService implements IStockFilterService {
  private readonly filters: filterOptions;

  constructor({ filters }: { filters: filterOptions }) {
    this.filters = filters;
  }

  FilterStocks(stocks: Stock[]): Stock[] {
    return stocks.filter(
      (s) =>
        StockFilterService.filterNumber(
          s.price,
          this.filters.priceMin,
          this.filters.priceMax,
        ) &&
        StockFilterService.filterNumber(
          s.beta,
          this.filters.betaMin,
          this.filters.betaMax,
        ),
    );
  }

  private static filterNumber(
    value: number | undefined,
    min?: number,
    max?: number,
  ): boolean {
    if (!value) {
      return false;
    }
    if (min && value < min) {
      return false;
    }
    if (max && value > max) {
      return false;
    }
    return true;
  }
}
