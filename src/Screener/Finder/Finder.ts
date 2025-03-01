import { Stock } from '~/Common/Stock';
import IStockRetrieverService from '../StockRetrieverService/IStockRetrieverService';
import { IFinder } from './IFinder';
import pLimit from 'p-limit';

type FinderArgs = {
  stockRetrieverService: IStockRetrieverService;
};

const getOptionDateString = (
  day: number,
  month?: number,
  year?: number,
): string => {
  const now = new Date();
  const yearString = (year ?? now.getFullYear()).toString().slice(-2);
  const monthString = (month ?? now.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed, so add 1
  const dayString = day.toString().padStart(2, '0'); // Format day as 2 digits
  return `${yearString}${monthString}${dayString}`; // Format as "YYMMDD"
};

const getNextThirdFriday = (): Date => {
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();

  while (true) {
    const firstDayOfNextMonth = new Date(year, month + 1, 1);

    const firstFriday = new Date(firstDayOfNextMonth);
    firstFriday.setDate(
      firstFriday.getDate() + ((5 - firstFriday.getDay() + 7) % 7),
    );

    const thirdFriday = new Date(firstFriday);
    thirdFriday.setDate(firstFriday.getDate() + 14);

    if (thirdFriday > now) {
      return thirdFriday;
    }

    month = (month + 1) % 12;
    if (month === 0) {
      year += 1;
    }
  }
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

  private async processInBatchesAsync<T, R>(
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

  async GetCominationStocks(combinationLength: number): Promise<Stock[]> {
    const possibleTickers: string[] = getCombinations(combinationLength);

    const tickers = await this.processInBatchesAsync(
      possibleTickers,
      Finder.batchSize,
      this.stockRetrieverService.GetQuotes,
    );

    const validStocks = tickers.flat().filter((t) => !!t);

    const thirdFriday = getNextThirdFriday();
    const optionDateString = getOptionDateString(
      thirdFriday.getDate(),
      thirdFriday.getMonth() + 1, //since january = 0
      thirdFriday.getFullYear(),
    );

    const optionTickers = validStocks.map(
      (stock) =>
        `${stock.ticker}${optionDateString}C${Math.round(stock.price).toString().padStart(5, '0')}000`,
    );

    const options = await this.processInBatchesAsync(
      optionTickers,
      Finder.batchSize,
      this.stockRetrieverService.GetOptionQuotes,
    );

    const validOptions = options.flat().filter((t) => !!t);

    return validStocks.map((stock) => ({
      optionable: validOptions.some((option) =>
        option.ticker.includes(stock.ticker),
      ),
      ...stock,
    }));
  }
}
