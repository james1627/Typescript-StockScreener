import { Stock } from '~/Common/Stock';
import IStockRetrieverService from '../StockRetrieverService/IStockRetrieverService';
import { IFinder } from './IFinder';
import pLimit from 'p-limit';

type FinderArgs = {
  stockRetrieverService: IStockRetrieverService;
};

async function processInBatchesAsync<T, R>(
  items: T[],
  batchSize: number,
  callback: (batch: T[]) => Promise<R>,
  concurrency: number = 5,
): Promise<R[]> {
  const limit = pLimit(concurrency);
  const batches = Array.from(
    { length: Math.ceil(items.length / batchSize) },
    (_, i) => items.slice(i * batchSize, i * batchSize + batchSize),
  );

  const promises = batches.map((batch) => limit(() => callback(batch)));

  return Promise.all(promises);
}

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
