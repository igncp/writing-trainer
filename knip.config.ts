import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  exclude: ['binaries'],
  ignore: ['src/react-ui/graphql/graphql.ts'],
  entry: [
    '.prettierrc.js',
    'eslint.config.mjs',
    'jest.config.js',
    'scripts/test/testSetup.js',
    'src/**/__tests__/**/*.ts',
    'src/**/__tests__/**/*.tsx',
    'src/chrome-extension/*.tsx',
    'src/pages/*.tsx',
    'webpack.prod.js',
  ],
};

export default config;
