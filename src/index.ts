import FileSystemService from './common/FileSystemService';
import Finder from './Finder/Finder';
import { ConsoleLoggerService } from './common/ConsoleLoggerService';
import StockRetrieverService from './StockRetrieverService/StockRetrieverService';
import StockFileRepository from './Repository/StockFileRepository';

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
  storedStocks.forEach((s) => logger.info(`${s.ticker}: ${s.price}`));
  // const retriever = new StockRetrieverService({logger});
  // const quote = await retriever.GetQuote("aapl");
  // if(quote){
  //   logger.info(`${quote.ticker}: ${quote.price}`);
  // }
}

main();
