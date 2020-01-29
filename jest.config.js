module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
  resetMocks: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
