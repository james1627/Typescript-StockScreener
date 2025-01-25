import { Stock } from '~/common/Stock';
import { IStockRepository } from './IStockRepository';
import IFileSystemService from '~/common/IFileSystemService';

export type StockFileRepositoryProps = {
  fileSystemService: IFileSystemService;
};

export default class StockFileRepository implements IStockRepository {
  private readonly fileSystemService: IFileSystemService;

  private static readonly fileToStore: string = 'stocks.txt';

  constructor({ fileSystemService }: StockFileRepositoryProps) {
    this.fileSystemService = fileSystemService;
  }

  async storeStocks(stocks: Stock[]): Promise<Stock[]> {
    let storedStocksString = '';
    if (await this.fileSystemService.exists(StockFileRepository.fileToStore)) {
      storedStocksString = await this.fileSystemService.readFile(
        StockFileRepository.fileToStore,
      );
    }

    let stocksToStore: Stock[] = stocks;
    if (storedStocksString) {
      const storedStocks = JSON.parse(storedStocksString);
      stocksToStore = stocksToStore.concat(storedStocks);
    }

    stocksToStore = stocksToStore.filter(
      (stock, index, self) =>
        index === self.findIndex((s) => s.ticker === stock.ticker),
    );

    await this.fileSystemService.writeFile(
      StockFileRepository.fileToStore,
      JSON.stringify(stocksToStore),
    );

    return stocksToStore;
  }

  async getStoredStocks(): Promise<Stock[]> {
    let storedStocksString = '';
    if (await this.fileSystemService.exists(StockFileRepository.fileToStore)) {
      storedStocksString = await this.fileSystemService.readFile(
        StockFileRepository.fileToStore,
      );
    }

    let storedStocks: Stock[] = [];
    if (storedStocksString) {
      storedStocks = JSON.parse(storedStocksString);
    }

    return storedStocks;
  }
}
