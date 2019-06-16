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
      __USE_CHROME_API__: false
    })
  ],
  module: buildConfig.module,
  resolve: buildConfig.resolve,
}

module.exports = config
