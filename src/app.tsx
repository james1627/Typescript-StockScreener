import React from 'react';
import express, { Request, Response } from 'express';
import { ConsoleLoggerService } from './Common/ConsoleLoggerService';
import ScreenerConfig from './ScreenerConfig';
import Filter from './Commands/Filter';
import Screener from './GetScreener';
import FileSystemService from './Common/FileSystemService';
import Load from './Commands/load';
import { PostgresProvider } from './Common/Database/PostgresProvider';
import yahooFinance from 'yahoo-finance2';
import { filterOptions } from './Screener/StockFilterService/IStockFilterService';
import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import App from './frontend/app';
import cors from 'cors';

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
app.use(cors());

app.get('/', (res: Response) => {
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
    quote = await yahooFinance.quote(
      ticker,
      {
        fields: [
          'symbol',
          'shortName',
          'regularMarketPrice',
          'bid',
          'ask',
          'regularMarketVolume',
        ],
      },
      { validateResult: false },
    );
  }

  res.json(quote);
});

app.get('/api/filter', async (req: Request, res: Response) => {
  let filters: filterOptions;
  try {
    filters = req.query;
  } catch {
    res.sendStatus(400);
    return;
  }

  const filterTask = new Filter({
    logger,
    stockrepository: screener.repository,
  });
  const stocks = await filterTask.runTask(filters);

  res.json(stocks);
});

app.get('/', (res: Response) => {
  fs.readFile(path.resolve('./public/index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`,
      ),
    );
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
