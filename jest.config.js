module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__stories__/**',
    '!**/__tests__/**',
  ],
  coverageReporters: ['json', 'lcov', 'text-summary', 'cobertura'],
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
  },
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/$1',
    '^.+.csv$': '<rootDir>/helpers/test/mockCsv.js',
  },
  roots: ['<rootDir>/src'],
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/helpers/test/testSetup.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
