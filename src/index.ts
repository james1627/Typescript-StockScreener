import FileSystemService from './common/FileSystemService';
import Finder from './Finder/Finder';
import { ConsoleLoggerService } from './common/ConsoleLoggerService';
import StockRetrieverService from './StockRetrieverService/StockRetrieverService';
import StockFileRepository from './Repository/StockFileRepository';
import StockFilterService from './StockFilterService/StockFilterService';

async function main() {
  const logger = new ConsoleLoggerService({ logLevel: 'INFO' });
  const fileSystemService = new FileSystemService();
  const retriever = new StockRetrieverService({ logger });
  const repository = new StockFileRepository({ fileSystemService });

  // const finder = new Finder({
  //   stockRetrieverService: retriever,
  // });
  // const stocks = await finder.GetCominationStocks(3);

  const storedStocks = await repository.getStoredStocks();

  const filterService = new StockFilterService({ filters: { priceMax: 12 } });
  const filteredStocks = filterService.FilterStocks(storedStocks);
  filteredStocks.forEach((s) => logger.info(`${s.ticker}: ${s.price}`));
  logger.info(`${filteredStocks.length}`);
}

main();
