const globalConfig = require('../../jest.config')

module.exports = Object.assign(globalConfig, {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__stories__/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
  globals: {
    __TEST__: true,
    __USE_CHROME_TABS_FEATURE__: true,
  },
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
    '^.+.csv$': '<rootDir>/helpers/test/mockCsv.js',
    '^.+.txt$': '<rootDir>/helpers/test/mockTxt.js',
    '^.+.yml$': '<rootDir>/helpers/test/mockYml.js',
  },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/helpers/test/testSetup.js'],
  testEnvironment: 'jsdom',
})
