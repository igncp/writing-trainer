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
  coverageThreshold: {
    global: {
      branches: 0,
      statements: 1,
      functions: 1,
      lines: 1,
    },
  },
}
