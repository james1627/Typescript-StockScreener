import { Stock } from '~/Common/stock';

export interface IFinder {
  GetCominationStocks(combinationLength: number): Promise<Stock[]>;
}
