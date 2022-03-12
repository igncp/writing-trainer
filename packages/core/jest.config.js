const globalConfig = require('../../jest.config')

module.exports = Object.assign(globalConfig, {
  collectCoverageFrom: [
    '!**/__stories__/**',
    '!**/__tests__/**',
    'src/**/*.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  globals: {
    __TEST__: true, // @TODO: use NODE_ENV
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
    '^.+.csv$': '<rootDir>/helpers/test/mockCsv.js',
  },
  roots: ['<rootDir>/src', '<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/helpers/test/testSetup.js'],
})
