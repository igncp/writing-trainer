export default {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: config => {
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
      {
        loader: 'text-loader',
        test: /\.txt$/,
      },
    )

    return config
  },
  ...(process.env.WEBAPP_PATH_PREFIX && {
    basePath: process.env.WEBAPP_PATH_PREFIX,
  }),
}
