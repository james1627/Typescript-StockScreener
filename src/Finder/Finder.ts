import IFileSystemService from "../common/IFileSystemService";
import { IFinder } from "./IFinder";

type FinderArgs = {
    fileSystemService: IFileSystemService
};

export default class Finder implements IFinder {
    private readonly pathToAllStocks: string = "allstocks.txt";

    private readonly fileSystemService: IFileSystemService;

    constructor ({fileSystemService}: FinderArgs) {
        this.fileSystemService = fileSystemService;
    }

    async GetAllStocks(): Promise<void> {
        const data = await this.fileSystemService.readFile(this.pathToAllStocks);
        const possibleTickers = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        console.log(possibleTickers);
    }
}