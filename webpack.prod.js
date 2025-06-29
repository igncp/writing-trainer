const path = require('path');
const webpack = require('webpack');

const srcPath = path.join(__dirname, 'src/chrome-extension');

const plugins = [
  new webpack.DefinePlugin({
    __STORAGE_TYPE__: JSON.stringify('chrome'),
  }),
];

const config = {
  entry: {
    background: path.join(srcPath, 'background.tsx'),
    content: path.join(srcPath, 'content.tsx'),
    options: path.join(srcPath, 'options.tsx'),
    popup: path.join(srcPath, 'popup.tsx'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.chrome-extension.json',
        },
        test: /\.tsx?$/,
      },
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
      {
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: false,
          skipEmptyLines: true,
        },
        test: /\.csv$/,
      },
      {
        loader: 'yaml-loader',
        test: /\.ya?ml$/,
      },
      {
        loader: 'text-loader',
        test: /\.txt$/,
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist/js'),
  },
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/chrome-extension'),
      '#': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.csv'],
  },
};

module.exports = config;
