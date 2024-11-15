import yahooFinance from 'yahoo-finance2';
import FileSystemService from './common/FileSystemService';
import Finder from './Finder/Finder';

// Define the stocks you want to analyze
// const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB'];

// // Define the start and end dates for the analysis
// const start_date = '2020-01-01';
// const end_date = '2021-01-01';

async function main() {
  // const quote = await yahooFinance.quote('AAPL');
  // console.log(quote);
  const fileSystemService = new FileSystemService();
  const finder = new Finder({ fileSystemService });
  await finder.GetAllStocks();
}

// Collect the data
// const data = {};
// for (const stock of stocks) {
//   data[stock] = yahooFinance.download(stock, start=start_date, end=end_date)['Adj Close'];
// }
// data['^GSPC'] = yahooFinance..download('^GSPC', start=start_date, end=end_date)['Adj Close'];

main();

// // Convert the object to a JSON string
// const jsonString = JSON.stringify(data, null, 2); // Pretty-print with 2 spaces

// // Specify the file path
// const filePath = './output.json';

// // Write the JSON string to the file
// fs.writeFile(filePath, jsonString, (err) => {
//   if (err) {
//     console.error('Error writing file:', err);
//   } else {
//     console.log(`JSON written to ${filePath}`);
//   }
// });
