import { Stock } from '~/Common/stock';
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
        ) &&
        StockFilterService.filterNumber(
          s.ptb,
          this.filters.pTBMin,
          this.filters.pTBMax,
        ) &&
        StockFilterService.filterNumber(
          s.pe,
          this.filters.pEMin,
          this.filters.pEMax,
        ) &&
        StockFilterService.filterNumber(
          s.eps,
          this.filters.ePSMin,
          this.filters.ePSMax,
        ) &&
        StockFilterService.filterNumber(
          s.volume,
          this.filters.volumeMin,
          this.filters.volumeMax,
        ) &&
        StockFilterService.filterNumber(
          s.avgVolume,
          this.filters.avgVolumeMin,
          this.filters.avgVolumeMax,
        ) &&
        StockFilterService.filterNumber(
          s.ops,
          this.filters.oPSMin,
          this.filters.oPSMax,
        ) &&
        StockFilterService.filterNumber(
          s.rating,
          this.filters.ratingMin,
          this.filters.ratingMax,
        ) &&
        StockFilterService.filterBool(s.optionable, this.filters.optionable) &&
        StockFilterService.filterBool(
          s.divYield ? s.divYield > 0 : false,
          this.filters.hasDiv,
        ),
    );
  }

  private static filterBool(value?: boolean, shouldBe?: boolean): boolean {
    if (shouldBe === false) {
      return !value;
    }
    if (shouldBe) {
      if (value) {
        return value;
      }
      return false;
    }
    return true;
  }

  private static filterNumber(
    value: number | undefined,
    min?: number,
    max?: number,
  ): boolean {
    if (!value) {
      return true;
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
