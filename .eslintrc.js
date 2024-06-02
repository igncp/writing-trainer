const tsRules = {
  '@typescript-eslint/array-type': [2, { default: 'array-simple' }],
  '@typescript-eslint/explicit-member-accessibility': 2,
  '@typescript-eslint/lines-between-class-members': [
    2,
    'always',
    { exceptAfterSingleLine: true },
  ],
  '@typescript-eslint/method-signature-style': 2,
  '@typescript-eslint/no-confusing-non-null-assertion': 2,
  '@typescript-eslint/no-explicit-any': 2,
  '@typescript-eslint/no-redeclare': 2,
  '@typescript-eslint/no-shadow': 2,
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 2,
  '@typescript-eslint/no-unnecessary-condition': [
    2,
    { allowConstantLoopConditions: true },
  ],
  '@typescript-eslint/no-unnecessary-qualifier': 2,
  '@typescript-eslint/no-unnecessary-type-arguments': 2,
  '@typescript-eslint/no-unnecessary-type-assertion': 2,
  '@typescript-eslint/no-unnecessary-type-constraint': 2,
  '@typescript-eslint/no-unused-expressions': 2,
  '@typescript-eslint/no-unused-vars': 2,
  '@typescript-eslint/no-use-before-define': [
    2,
    {
      enums: true,
      ignoreTypeReferences: false,
      typedefs: true,
    },
  ],
  '@typescript-eslint/no-useless-constructor': 2,
  '@typescript-eslint/prefer-includes': 2,
  '@typescript-eslint/prefer-nullish-coalescing': 2,
  '@typescript-eslint/prefer-optional-chain': 2,
  '@typescript-eslint/prefer-readonly': 2,
  '@typescript-eslint/prefer-reduce-type-parameter': 2,
  '@typescript-eslint/prefer-return-this-type': 2,
  '@typescript-eslint/prefer-ts-expect-error': 2,
  '@typescript-eslint/switch-exhaustiveness-check': 2,
  '@typescript-eslint/unified-signatures': 2,
}

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:jest/recommended',
    'plugin:react-hooks/recommended',
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
        '@typescript-eslint/explicit-module-boundary-types': 0,
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
  plugins: ['@typescript-eslint', 'prettier', 'perfectionist'],
  rules: {
    ...tsRules,

    eqeqeq: 2,
    'newline-before-return': 2,
    'no-console': 2,
    'no-extra-semi': 0,
    'no-useless-return': 2,
    'object-shorthand': 2,

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

    'perfectionist/sort-array-includes': 2,
    'perfectionist/sort-classes': 2,
    'perfectionist/sort-enums': 2,
    'perfectionist/sort-exports': 2,
    'perfectionist/sort-interfaces': 2,
    'perfectionist/sort-named-exports': 2,
    'perfectionist/sort-object-types': 2,
    'perfectionist/sort-objects': 2,

    'prefer-template': 2,

    'prettier/prettier': 'error',

    'react-hooks/exhaustive-deps': 2,
    'react-hooks/rules-of-hooks': 2,

    'react/jsx-no-target-blank': 0,
    'react/jsx-sort-props': 2,
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
  },

  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        map: [['#', './src/']],
      },
    },
    react: {
      version: 'detect',
    },
  },
}
