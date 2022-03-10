const config = require('../../helpers/eslintConfig')

module.exports = Object.assign(config, {
  extends: config.extends.concat('plugin:react/recommended'),
  rules: {
    ...config.rules,

    'react/jsx-no-target-blank': 0,
    'react/jsx-sort-props': 2,
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
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
})
