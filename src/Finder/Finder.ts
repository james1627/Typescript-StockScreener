import IFileSystemService from "../common/IFileSystemService";
import { processInBatchesAsync } from "../common/utils";
import { IStockRetrieverService } from "../StockRetrieverService/IStockRetrieverService";
import { IFinder } from "./IFinder";

type FinderArgs = {
    fileSystemService: IFileSystemService
    stockRetrieverService: IStockRetrieverService;
};

const getCombinations = (length: number): string[] => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';

    if (length === 1) {
      return chars.split('');
    }

    const combinations: string[] = [];

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const smallerCombinations = getCombinations(length - 1);
      for (const smaller of smallerCombinations) {
        combinations.push(char + smaller);
      }
    }

    return combinations;
};

export default class Finder implements IFinder {
    private readonly pathToAllStocks: string = "allstocks.json";

    private readonly fileSystemService: IFileSystemService;

    private readonly stockRetrieverService: IStockRetrieverService;

    constructor ({fileSystemService, stockRetrieverService}: FinderArgs) {
        this.fileSystemService = fileSystemService;
        this.stockRetrieverService = stockRetrieverService;
    }

    async GetAllStocks(): Promise<void> {
        // const data = await this.fileSystemService.readFile(this.pathToAllStocks);

        // const possibleTickers: string[] = JSON.parse(data);
        const possibleTickers: string[] = getCombinations(3);

        const tickers = await processInBatchesAsync(possibleTickers, 1000, this.stockRetrieverService.GetQuotes);

        const activeTickers = tickers.flat().filter((t) => !!t).map((stock) => stock.ticker);

        await this.fileSystemService.writeFile("foundStocks4.json", JSON.stringify(activeTickers));
    }
}