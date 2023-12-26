const globalConfig = require('../../jest.config')

module.exports = Object.assign(globalConfig, {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__stories__/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 1, // @TODO
      functions: 1, // @TODO
      lines: 1, // @TODO
      statements: 1, // @TODO
    },
  },
  globals: {
    __STORAGE_TYPE__: 'dummy',
    __TEST__: true,
    __USE_CHROME_TABS_FEATURE__: true,
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '^.+.csv$': '<rootDir>/helpers/test/mockCsv.js',
    '^.+.txt$': '<rootDir>/helpers/test/mockTxt.js',
    '^.+.yml$': '<rootDir>/helpers/test/mockYml.js',
  },
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
})
