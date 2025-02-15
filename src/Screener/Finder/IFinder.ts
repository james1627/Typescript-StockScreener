import { Stock } from '~/Common/Stock';

export interface IFinder {
  GetCominationStocks(combinationLength: number): Promise<Stock[]>;
}
