const path = require('path')

const srcPath = path.join(__dirname, '../src')

const config = {
  mode: 'production',
  entry: {
    background: path.join(srcPath, 'background.ts'),
    content: path.join(srcPath, 'content.tsx'),
    options: path.join(srcPath, 'options.ts'),
    popup: path.join(srcPath, 'popup.ts'),
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
