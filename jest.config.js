module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__stories__/**',
    '!**/__tests__/**',
  ],
  globals: {
    __TEST__: true,
    __USE_CHROME_TABS_FEATURE__: true,
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/chrome-extension/$1',
    '#/(.*)$': '<rootDir>/src/$1',
    '^.+.csv$': '<rootDir>/scripts/test/mockCsv.js',
    '^.+.txt$': '<rootDir>/scripts/test/mockTxt.js',
    '^.+.yml$': '<rootDir>/scripts/test/mockYml.js',
  },
  preset: 'ts-jest',
  resetMocks: true,
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/scripts/test/testSetup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '.*.tsx?': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
}
