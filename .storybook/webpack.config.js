const webpack = require('webpack')

const buildConfig = require('../webpack.prod')

module.exports = ({ config }) => {
  buildConfig.module.rules.forEach(rule => {
    config.module.rules.push(rule)
  })

  config.resolve = buildConfig.resolve
  config.plugins.push(
    new webpack.DefinePlugin({
      __USE_CHROME_API__: false,
    })
  )

  return config
}
