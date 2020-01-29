const config = require('../../.eslintrc')

module.exports = Object.assign(config, {
  extends: config.extends.concat('plugin:react/recommended'),
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
