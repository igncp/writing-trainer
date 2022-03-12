exports.onCreateWebpackConfig = ({ plugins, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: false,
            skipEmptyLines: true,
          },
          test: /\.csv$/,
        },
      ],
    },
    plugins: [
      plugins.define({
        __TEST__: false,
      }),
    ],
  })
}
