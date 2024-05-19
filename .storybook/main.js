import { join, dirname } from 'path'
import path from 'path'
import webpack from 'webpack'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const configStorybook = {
  'addons': [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  'docs': {
    'autodocs': 'tag',
  },
  'framework': {
    'name': getAbsolutePath('@storybook/react-webpack5'),
    'options': {
      'builder': {
        'useSWC': true,
      },
    },
  },
  'stories': ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async config => {
    Object.assign(config.resolve.alias, {
      '#': path.resolve(__dirname, '../src'),
      '@': path.resolve(__dirname, '../src/chrome-extension'),
    })

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
      {
        loader: 'yaml-loader',
        test: /\.ya?ml$/,
      },
      {
        include: path.resolve(__dirname, '../'),
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('tailwindcss')],
              },
            },
          },
        ],
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
export default configStorybook
