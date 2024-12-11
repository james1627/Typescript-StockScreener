import FileSystemService from './common/FileSystemService';
import Finder from './Finder/Finder';
import { ConsoleLoggerService } from './common/ConsoleLoggerService';
import StockRetrieverService from './StockRetrieverService/StockRetrieverService';

async function main() {
  const logger = new ConsoleLoggerService();
  const fileSystemService = new FileSystemService();
  const retriever = new StockRetrieverService({logger});

  const finder = new Finder({ fileSystemService, stockRetrieverService: retriever });
  await finder.GetAllStocks();
  // const retriever = new StockRetrieverService({logger});
  // const quote = await retriever.GetQuote("aapl");
  // if(quote){
  //   logger.info(`${quote.ticker}: ${quote.price}`);
  // }
}

main();