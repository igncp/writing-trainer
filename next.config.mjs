import webpack from 'webpack';

export default {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    if (isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /writing-trainer-wasm*/,
          'src/pkg_mock.js',
        ),
      );
    }

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
    );

    return config;
  },
  ...(process.env.WEBAPP_PATH_PREFIX && {
    basePath: process.env.WEBAPP_PATH_PREFIX,
  }),
};
