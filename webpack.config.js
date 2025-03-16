import * as path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getModuleExports = () => ({
  mode: 'development',
  entry: './src/app.tsx', // Entry file of your app
  target: 'node', // Specify Node.js as the target environment
  output: {
    filename: 'app.cjs', // Output bundle name
    path: path.resolve(__dirname, 'dist'), // Output folder
    clean: true,
  },
  optimization: {
    minimize: true, // Optional: Minify the output
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // Resolve both TypeScript and JavaScript files
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
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', '.env'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
  ],
});

export default getModuleExports;
