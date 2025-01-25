import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getModuleExports = () => ({
  mode: 'development',
  entry: './src/cli.ts', // Entry file of your app
  target: 'node', // Specify Node.js as the target environment
  output: {
    filename: 'cli.cjs', // Output bundle name
    path: path.resolve(__dirname, 'dist'), // Output folder
    clean: true,
  },
  optimization: {
    minimize: true, // Optional: Minify the output
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve both TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match all .ts and .tsx files
        use: ['swc-loader'], // Use ts-loader to compile TypeScript files
        exclude: /node_modules/,
      },
    ],
  },
});

export default getModuleExports;
