const webpack = require('webpack')

const buildConfig = require('../webpack.prod')

module.exports = ({ config }) => {
  buildConfig.module.rules.forEach(rule => {
    config.module.rules.push(rule)
  })

  config.resolve = buildConfig.resolve

  config.plugins.push(
    new webpack.DefinePlugin({
      __STORAGE_TYPE__: JSON.stringify('localStorage'),
      __TEST__: false,
      __USE_CHROME_TABS_FEATURE__: false,
    })
  )

  return config
}
