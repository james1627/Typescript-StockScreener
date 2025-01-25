import { Stock } from '~/common/Stock';
import { processInBatchesAsync } from '../common/utils';
import { IStockRetrieverService } from '../StockRetrieverService/IStockRetrieverService';
import { IFinder } from './IFinder';

type FinderArgs = {
  stockRetrieverService: IStockRetrieverService;
};

const getCombinations = (length: number): string[] => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';

  if (length === 1) {
    return chars.split('');
  }

  const combinations: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const smallerCombinations = getCombinations(length - 1);
    for (const smaller of smallerCombinations) {
      combinations.push(char + smaller);
    }
  }

  return combinations;
};

export default class Finder implements IFinder {
  private readonly stockRetrieverService: IStockRetrieverService;

  private static readonly batchSize = 1000;

  constructor({ stockRetrieverService }: FinderArgs) {
    this.stockRetrieverService = stockRetrieverService;
  }

  async GetCominationStocks(combinationLength: number): Promise<Stock[]> {
    const possibleTickers: string[] = getCombinations(combinationLength);

    const tickers = await processInBatchesAsync(
      possibleTickers,
      Finder.batchSize,
      this.stockRetrieverService.GetQuotes,
    );

    return tickers.flat().filter((t) => !!t);
  }
}
