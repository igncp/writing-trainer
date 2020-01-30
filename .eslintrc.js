module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:jest/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/array-type': 2,
    '@typescript-eslint/brace-style': 2,
    '@typescript-eslint/no-floating-promises': 2,
    '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_' }],

    eqeqeq: 2,
    'newline-before-return': 2,
    'no-console': 2,
    'no-shadow': 2,
    'no-useless-return': 2,
    'prefer-template': 2,
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: '*', next: 'multiline-expression' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
    ],
    'sort-keys': 2,
  },

  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        'no-console': 0,
      },
    },
    {
      files: ['**/*.{ts,tsx,js}'],
      rules: {
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/class-name-casing': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-non-null-assertion': 0,

        'no-console': 0,
        'require-atomic-updates': 0,
        semi: 0,
      },
    },
    {
      files: ['**/*.{ts,tsx,js}'],
      rules: {
        'import/named': 0, // in TS this is not important
      },
    },
    {
      files: ['**/__tests__/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
  ],
}
