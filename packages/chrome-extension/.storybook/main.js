const webpack = require('webpack')
const webpackConf = require('../webpack.prod.js')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  features: {
    postcss: false,
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  webpackFinal: config => {
    Object.assign(config.resolve.alias, webpackConf.resolve.alias)

    config.resolve.extensions = config.resolve.extensions
      .concat(webpackConf.resolve.extensions)
      .filter((item, index, arr) => arr.indexOf(item) === index)

    config.module.rules.push(
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
    )

    config.plugins.push(
      new webpack.DefinePlugin({
        __STORAGE_TYPE__: JSON.stringify('localStorage'),
        __TEST__: false,
        __USE_CHROME_TABS_FEATURE__: false,
      }),
    )

    return config
  },
}
