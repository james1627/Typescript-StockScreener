import IFileSystemService from './Common/IFileSystemService';
import { ILoggerService } from './Common/ILoggerService';
import Finder from './Screener/Finder/Finder';
import { IFinder } from './Screener/Finder/IFinder';
import { IStockRepository } from './Screener/Repository/IStockRepository';
import StockFileRepository from './Screener/Repository/StockFileRepository';
import IStockRetrieverService from './Screener/StockRetrieverService/IStockRetrieverService';
import StockRetrieverService from './Screener/StockRetrieverService/StockRetrieverService';

type ScreenerValues = {
  repository: IStockRepository;
  retriever: IStockRetrieverService;
  finder: IFinder;
};

export default class Screener {
  readonly repository: IStockRepository;
  readonly retriever: IStockRetrieverService;
  readonly finder: IFinder;

  constructor({ repository, retriever, finder }: ScreenerValues) {
    this.finder = finder;
    this.repository = repository;
    this.retriever = retriever;
  }

  static GetScreener(
    logger: ILoggerService,
    fileSystemService: IFileSystemService,
    fileDirectory: string,
  ) {
    const repository = new StockFileRepository({
      fileSystemService,
      fileDirectory,
    });
    const retriever = new StockRetrieverService({ logger });
    const finder = new Finder({
      stockRetrieverService: retriever,
    });
    return new Screener({ repository, retriever, finder });
  }
}
