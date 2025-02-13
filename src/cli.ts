#!/usr/bin/env node

import { Command } from 'commander';
import { ConsoleLoggerService } from './common/ConsoleLoggerService';
import { ILoggerService, LogLevel } from './common/ILoggerService';
import filter from './Commands/Filter';
import load from './Commands/load';

type services = {
  logger: ILoggerService;
};

type GlobalOptions = {
  logLevel: LogLevel;
};

async function getServices(options: GlobalOptions): Promise<services> {
  const logger = new ConsoleLoggerService({ logLevel: options.logLevel });
  return { logger };
}

function readNumber(num: string): number {
  const parsedFloat = parseFloat(num);
  if (isNaN(parsedFloat)) {
    throw new Error(`Invalid number: ${num}`);
  }
  return parsedFloat;
}

const program = new Command();

program.version('1.0.0').description('A sample CLI built with Webpack');

program
  .command('load-combinations <num>')
  .description('load stock combinations of letters')
  .option('-l, --location', 'location to store output')
  .action(async (num) => {
    const combinations = parseInt(num);

    const { logger } = await getServices({ logLevel: 'INFO' });

    load({ logger, combinations });
  });

program
  .command('filter')
  .description('filter the stocks given some options')
  .option('--pmin <number>', 'minimum price', undefined)
  .option('--pmax <number>', 'maximum price', undefined)
  .option('--betaMin <number>', 'minimum beta', undefined)
  .option('--betaMax <number>', 'maximum beta', undefined)
  .action(async (options) => {
    const priceMin = readNumber(options.pmin);
    const priceMax = readNumber(options.pmax);
    const betaMin = readNumber(options.betaMin);
    const betaMax = readNumber(options.betaMax);

    const { logger } = await getServices({ logLevel: 'INFO' });

    filter({ logger, filters: { priceMax, priceMin, betaMin, betaMax } });
  });

program.parse(process.argv);
