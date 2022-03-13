const webpack = require('webpack')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  features: {
    postcss: false,
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  webpackFinal: config => {
    config.resolve.extensions = config.resolve.extensions
      .concat(['.csv'])
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
        __TEST__: false,
        __USE_CHROME_TABS_FEATURE__: false,
      }),
    )

    return config
  },
}
