module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__stories__/**',
    '!**/__tests__/**',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageReporters: ['json', 'lcov', 'text-summary', 'cobertura'],
  setupFilesAfterEnv: ['<rootDir>/helpers/test/testSetup.js'],
  moduleNameMapper: {
    '#/(.*)$': '<rootDir>/src/frontend/$1',
    '^.+.csv$': '<rootDir>/helpers/test/mockCsv.js',
  },
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
}
