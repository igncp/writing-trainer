const paddingRule = [
  'error',
  { blankLine: 'always', next: 'return', prev: '*' },
]
  .concat(
    [
      'const',
      'if',
      'interface',
      'multiline-block-like',
      'multiline-const',
      'multiline-expression',
      'type',
    ]
      .map(item => [
        { blankLine: 'always', next: '*', prev: item },
        { blankLine: 'always', next: item, prev: '*' },
      ])
      .flat(),
  )
  .concat([
    {
      blankLine: 'any',
      next: ['singleline-const'],
      prev: ['singleline-const'],
    },
  ])

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
        'semi': 0,
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
  plugins: [
    '@stylistic',
    '@typescript-eslint',
    'import',
    'perfectionist',
    'prettier',
    'react-hooks',
  ],
  rules: {
    ...tsRules,

    '@stylistic/padding-line-between-statements': paddingRule,

    'eqeqeq': 2,

    'import/no-duplicates': 'error',

    'newline-before-return': 2,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-else-return': 'error',
    'no-extra-semi': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-useless-return': 'error',
    'object-shorthand': 'error',

    'perfectionist/sort-array-includes': 2,
    'perfectionist/sort-classes': 2,
    'perfectionist/sort-enums': 2,
    'perfectionist/sort-exports': 2,
    'perfectionist/sort-interfaces': 2,
    'perfectionist/sort-named-exports': 2,
    'perfectionist/sort-object-types': 2,
    'perfectionist/sort-objects': 2,

    'prefer-const': 'error',
    'prefer-destructuring': ['error', { array: false, object: true }],
    'prefer-spread': 'error',
    'prefer-template': 'error',

    'prettier/prettier': 'error',

    'quote-props': ['error', 'consistent-as-needed'],

    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',

    'react/destructuring-assignment': [
      'error',
      'always',
      { destructureInSignature: 'always' },
    ],
    'react/display-name': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/jsx-filename-extension': 'off',
    'react/jsx-fragments': 'error',
    'react/jsx-key': ['error', { warnOnDuplicates: true }],
    'react/jsx-no-target-blank': 'off',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': 'error',
    'react/no-array-index-key': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'react/no-unstable-nested-components': 'error',
    'react/no-unused-prop-types': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/self-closing-comp': 'error',
  },

  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        map: [['#', './src/']],
      },
    },
    'react': {
      version: 'detect',
    },
  },
}
