import { ILoggerService } from '~/Common/ILoggerService';
import { IStockRepository } from '../Screener/Repository/IStockRepository';
import { IFinder } from '../Screener/Finder/IFinder';

type LoadArgs = {
  logger: ILoggerService;
  stockRepository: IStockRepository;
  finder: IFinder;
};

export default class Load {
  private readonly logger: ILoggerService;
  private readonly stockRepository: IStockRepository;
  private readonly finder: IFinder;

  constructor({ logger, stockRepository, finder }: LoadArgs) {
    this.logger = logger;
    this.stockRepository = stockRepository;
    this.finder = finder;
  }

  async runTask(combinations: number): Promise<void> {
    const stocks = await this.finder.GetCominationStocks(combinations);
    const storedStocks = await this.stockRepository.storeStocks(stocks);

    this.logger.log(`Stored ${stocks.length} total stocks.`);
    this.logger.log(`There are now ${storedStocks.length} stocks stored.`);
  }
}
