import { Stock } from '~/Common/Stock';
import { IStockRepository } from './IStockRepository';
import IFileSystemService from '~/Common/IFileSystemService';

export type StockFileRepositoryProps = {
  fileSystemService: IFileSystemService;
  fileDirectory: string;
};

function mergeUniqueObjects<T, K extends keyof T>(
  arr1: T[],
  arr2: T[],
  key: K,
): T[] {
  const merged = [...arr1, ...arr2];
  const seen = new Map<T[K], T>();

  return merged.filter((item) => {
    if (seen.has(item[key])) {
      return false;
    }
    seen.set(item[key], item);
    return true;
  });
}

export default class StockFileRepository implements IStockRepository {
  private readonly fileSystemService: IFileSystemService;

  private readonly fileDirectory: string;

  private static readonly fileToStore: string = 'stocks.txt';

  constructor({ fileSystemService, fileDirectory }: StockFileRepositoryProps) {
    this.fileSystemService = fileSystemService;
    this.fileDirectory = fileDirectory;
  }

  async storeStocks(stocks: Stock[]): Promise<Stock[]> {
    const locationToStore = `${this.fileDirectory}/${StockFileRepository.fileToStore}`;

    let stocksToStore: Stock[] = stocks;

    if (await this.fileSystemService.exists(locationToStore)) {
      const storedStocksString =
        await this.fileSystemService.readFile(locationToStore);
      const storedStocks: Stock[] = JSON.parse(storedStocksString);

      stocksToStore = mergeUniqueObjects(stocks, storedStocks, 'ticker');
    }

    await this.fileSystemService.writeFile(
      locationToStore,
      JSON.stringify(stocksToStore),
    );

    return stocksToStore;
  }

  async getStoredStocks(): Promise<Stock[]> {
    const locationToStore = `${this.fileDirectory}/${StockFileRepository.fileToStore}`;

    let storedStocksString = '';
    if (await this.fileSystemService.exists(locationToStore)) {
      storedStocksString =
        await this.fileSystemService.readFile(locationToStore);
    }

    let storedStocks: Stock[] = [];
    if (storedStocksString) {
      storedStocks = JSON.parse(storedStocksString);
    }

    return storedStocks;
  }
}
