module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:jest/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    __TEST__: true,
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
      files: ['**/__tests__/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/array-type': 2,
    '@typescript-eslint/brace-style': 2,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-floating-promises': 2,
    '@typescript-eslint/no-shadow': 2,
    '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_' }],

    eqeqeq: 2,
    'newline-before-return': 2,
    'no-console': 2,
    'no-useless-return': 2,
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: 'if',
        prev: '*',
      },
      {
        blankLine: 'always',
        next: 'multiline-expression',
        prev: '*',
      },
      {
        blankLine: 'always',
        next: 'block-like',
        prev: '*',
      },
    ],
    'prefer-template': 2,
    'prettier/prettier': 'error',
    'sort-keys': 2,
  },
}
