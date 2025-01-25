import { Stock } from '~/common/Stock';

export interface IFinder {
  GetCominationStocks(combinationLength: number): Promise<Stock[]>;
}
