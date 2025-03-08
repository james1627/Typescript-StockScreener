import { Stock } from '~/Common/Stock';

export type filterOptions = {
  priceMin?: number;
  priceMax?: number;
  betaMin?: number;
  betaMax?: number;
  pTBMax?: number;
  pTBMin?: number;
  pEMax?: number;
  pEMin?: number;
  ePSMax?: number;
  ePSMin?: number;
  volumeMax?: number;
  volumeMin?: number;
  avgVolumeMax?: number;
  avgVolumeMin?: number;
  oPSMax?: number;
  oPSMin?: number;
  hasDiv?: boolean;
  optionable?: boolean;
};

export default interface IStockSorterService {
  FilterStocks(stocks: Stock[]): Stock[];
}
