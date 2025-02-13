import express, { Request, Response } from 'express';
import { ConsoleLoggerService } from './common/ConsoleLoggerService';
import load from './Commands/load';
import filter from './Commands/Filter';

const app = express();
const port = 3000;

const logger = new ConsoleLoggerService({ logLevel: 'INFO' });

app.use(express.json());

function getRequiredArgument(value: unknown, name: string): string {
  if (typeof value !== 'string') {
    throw Error(`Required Argument ${name} not provided!`);
  }
  return value;
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.post('/api/loadstocks', async (req: Request, res: Response) => {
  const combinations = parseInt(
    getRequiredArgument(req.query.number, 'combinations'),
  );

  await load({ logger, combinations });
  res.sendStatus(200);
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

  const stocks = await filter({
    logger,
    filters: { priceMax, priceMin, betaMin: 0, betaMax: 2 },
  });
  res.json(stocks);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
