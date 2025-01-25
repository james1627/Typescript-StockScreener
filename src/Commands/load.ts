import FileSystemService from '../common/FileSystemService';
import { ILoggerService } from '../common/ILoggerService';
import Finder from '../Finder/Finder';
import StockFileRepository from '../Repository/StockFileRepository';
import StockRetrieverService from '../StockRetrieverService/StockRetrieverService';

type LoadArgs = {
  logger: ILoggerService;
  combinations: number;
};

export default async function load({
  logger,
  combinations,
}: LoadArgs): Promise<void> {
  const fileSystemService = new FileSystemService();
  const repository = new StockFileRepository({ fileSystemService });
  const retriever = new StockRetrieverService({ logger });
  const finder = new Finder({
    stockRetrieverService: retriever,
  });

  const stocks = await finder.GetCominationStocks(combinations);
  const storedStocks = await repository.storeStocks(stocks);

  logger.log(`Stored ${stocks.length} total stocks.`);
  logger.log(`There are now ${storedStocks.length} stocks stored.`);
}
