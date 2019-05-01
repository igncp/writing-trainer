const path = require('path')

const config = {
  mode: 'production',
  entry: {
    background: path.join(__dirname, '../src/background.ts'),
    options: path.join(__dirname, '../src/options.ts'),
    popup: path.join(__dirname, '../src/popup.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}

module.exports = config
