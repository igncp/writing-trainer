const path = require('path')
const webpack = require('webpack')

const rules = [
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
]

module.exports = ({ config }) => {
  rules.forEach(rule => {
    config.module.rules.push(rule)
  })

  config.resolve = {
    alias: {
      '#': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.csv'],
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      __TEST__: false,
      __USE_CHROME_TABS_FEATURE__: false,
    }),
  )

  return config
}
