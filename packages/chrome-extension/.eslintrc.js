const config = require('../../.eslintrc')

module.exports = Object.assign(config, {
  extends: config.extends.concat('plugin:react/recommended'),
  rules: {
    ...config.rules,
    'react/jsx-sort-props': 2,

    'react/jsx-no-target-blank': 0,
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['#', './src/']],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
    react: {
      version: 'detect',
    },
  },
})
