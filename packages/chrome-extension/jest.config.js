const globalConfig = require('../../jest.config')

module.exports = Object.assign(globalConfig, {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__stories__/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
  globals: {
    __STORAGE_TYPE__: 'dummy',
    __TEST__: true,
    __USE_CHROME_TABS_FEATURE__: true,
  },
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
    '^.+.csv$': '<rootDir>/helpers/test/mockCsv.js',
  },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/helpers/test/testSetup.js'],
})
