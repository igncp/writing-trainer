const path = require('path')
const webpack = require('webpack')

const buildConfig = require('../../../webpack.prod.js')

const config = {
  mode: 'production',
  target: 'node',
  stats: 'errors-only',
  entry: {
    prepare: path.resolve(__dirname, 'prepareJapaneseText.tsx'),
    add: path.resolve(__dirname, 'addJapaneseText.tsx'),
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js',
  },
  node: {
    __dirname: false
  },
  plugins: [
    new webpack.DefinePlugin({
      __STORAGE_TYPE__: JSON.stringify('dummy'),
      __TEST__: false,
      __USE_CHROME_TABS_FEATURE__: false,
    })
  ],
  module: buildConfig.module,
  resolve: buildConfig.resolve,
}

module.exports = config
