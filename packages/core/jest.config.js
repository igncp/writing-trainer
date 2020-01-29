const globalConfig = require('../../jest.config')

module.exports = Object.assign(globalConfig, {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__stories__/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globals: {
    __TEST__: true,
  },
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
    '^.+.csv$': '<rootDir>/helpers/test/mockCsv.js',
  },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/helpers/test/testSetup.js'],
})
