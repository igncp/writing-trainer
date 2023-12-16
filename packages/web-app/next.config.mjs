import webpack from 'webpack'

export default {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __TEST__: false,
      }),
    )

    config.module.rules.push(
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
    )

    return config
  },
}
