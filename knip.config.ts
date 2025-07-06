import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  exclude: ['binaries'],
  ignore: ['src/react-ui/graphql/graphql.ts'],
  entry: [
    'src/chrome-extension/*.tsx',
    'src/pages/*.tsx',
    'src/**/__tests__/**/*.tsx',
    'src/**/__tests__/**/*.ts',
  ],
};

export default config;
