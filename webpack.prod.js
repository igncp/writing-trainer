const path = require('path')
const webpack = require('webpack')

const srcPath = path.join(__dirname, 'src')

const plugins = [
  new webpack.DefinePlugin({
    __STORAGE_TYPE__: JSON.stringify('chrome'),
    __USE_CHROME_TABS_FEATURE__: true,
    __TEST__: false,
  }),
]

const config = {
  mode: 'production',
  entry: {
    background: path.join(srcPath, 'background.tsx'),
    content: path.join(srcPath, 'content.tsx'),
    options: path.join(srcPath, 'options.tsx'),
    popup: path.join(srcPath, 'popup.tsx'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: false,
          skipEmptyLines: true,
        },
      },
    ],
  },
  plugins,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.csv'],
    alias: {
      '#': path.resolve(__dirname, 'src'),
    },
  },
}

module.exports = config
