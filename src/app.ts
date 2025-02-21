import express, { Request, Response } from 'express';
import { ConsoleLoggerService } from './Common/ConsoleLoggerService';
import ScreenerConfig from './ScreenerConfig';
import Filter from './Commands/Filter';
import Screener from './GetScreener';
import FileSystemService from './Common/FileSystemService';
import Load from './Commands/load';
import { PostgresProvider } from './Common/Database/PostgresProvider';
import yahooFinance from 'yahoo-finance2';

function getRequiredArgument(value: unknown, name: string): string {
  if (typeof value !== 'string') {
    throw Error(`Required Argument ${name} not provided!`);
  }
  return value;
}

const app = express();

const config = new ScreenerConfig();
const logger = new ConsoleLoggerService({
  logLevel: config.logLevel ?? 'INFO',
});
const fileSystemService = new FileSystemService();

let databaseProvider = undefined;
if (config.databaseConnectionString) {
  databaseProvider = new PostgresProvider(config.databaseConnectionString);
  await databaseProvider.connect();
}

const screener = Screener.GetScreener(
  logger,
  fileSystemService,
  config.basePath,
  databaseProvider,
);

const port = config.port;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.post('/api/loadstocks', async (req: Request, res: Response) => {
  const combinations =
    parseInt(getRequiredArgument(req.query.combinations, 'combinations')) ?? 3;

  const loader = new Load({
    logger,
    stockRepository: screener.repository,
    finder: screener.finder,
  });
  loader.runTask(combinations);

  res.sendStatus(200);
});

app.get('/api/quote', async (req: Request, res: Response) => {
  let ticker: string;
  try {
    ticker = getRequiredArgument(req.query.ticker, 'ticker');
  } catch {
    res.sendStatus(400);
    return;
  }
  let quote;
  if (req.query.q) {
    quote = await screener.retriever.GetQuote(ticker);
  } else {
    quote = await yahooFinance.quote(ticker);
  }
  res.json(quote);
});

app.get('/api/filter', async (req: Request, res: Response) => {
  let priceMax, priceMin;
  try {
    priceMax = parseInt(getRequiredArgument(req.query.priceMax, 'priceMax'));
    priceMin = parseInt(getRequiredArgument(req.query.priceMin, 'priceMin'));
  } catch {
    res.sendStatus(400);
    return;
  }

  const filterTask = new Filter({
    logger,
    stockrepository: screener.repository,
  });
  const stocks = await filterTask.runTask({
    priceMax,
    priceMin,
    betaMin: 0,
    betaMax: 2,
  });

  res.json(stocks);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
