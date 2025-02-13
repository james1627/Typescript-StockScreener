import { filterOptions } from '~/StockFilterService/IStockFilterService';
import FileSystemService from '../common/FileSystemService';
import { ILoggerService } from '../common/ILoggerService';
import StockFileRepository from '../Repository/StockFileRepository';
import StockFilterService from '../StockFilterService/StockFilterService';
import { Stock } from '~/common/Stock';

type FilterArgs = {
  logger: ILoggerService;
  filters: filterOptions;
};

export default async function filter({
  logger,
  filters,
}: FilterArgs): Promise<Stock[]> {
  const fileSystemService = new FileSystemService();
  const repository = new StockFileRepository({ fileSystemService });
  const stocks = await repository.getStoredStocks();

  const filterService = new StockFilterService({
    filters,
  });
  const filteredStocks = filterService.FilterStocks(stocks);

  logger.log(`Result: ${filteredStocks.length}`);
  logger.log(`Stocks: ${filteredStocks.map(({ ticker }) => ticker)}`);
  return filteredStocks;
}
