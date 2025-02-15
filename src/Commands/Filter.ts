import { filterOptions } from '../Screener/StockFilterService/IStockFilterService';
import { ILoggerService } from '~/Common/ILoggerService';
import StockFilterService from '../Screener/StockFilterService/StockFilterService';
import { IStockRepository } from '../Screener/Repository/IStockRepository';

type FilterArgs = {
  logger: ILoggerService;
  stockrepository: IStockRepository;
};

export default class Filter {
  private readonly logger: ILoggerService;
  private readonly stockrepository: IStockRepository;

  constructor({ logger, stockrepository }: FilterArgs) {
    this.logger = logger;
    this.stockrepository = stockrepository;
  }

  async runTask(filters: filterOptions) {
    const stocks = await this.stockrepository.getStoredStocks();

    const filterService = new StockFilterService({
      filters,
    });
    const filteredStocks = filterService.FilterStocks(stocks);

    this.logger.log(`Result: ${filteredStocks.length}`);
    this.logger.log(`Stocks: ${filteredStocks.map(({ ticker }) => ticker)}`);
    return filteredStocks;
  }
}
