const path = require('path')
const webpack = require('webpack')

const srcPath = path.join(__dirname, 'src')

const plugins = [
  new webpack.DefinePlugin({
    __STORAGE_TYPE__: JSON.stringify('chrome'),
    __TEST__: false,
    __USE_CHROME_TABS_FEATURE__: true,
  }),
]

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
        test: /\.tsx?$/,
        use: 'ts-loader',
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
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist/js'),
  },
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.csv'],
  },
}

module.exports = config
