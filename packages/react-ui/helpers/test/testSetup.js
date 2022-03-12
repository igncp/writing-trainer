require('react-testing-library/cleanup-after-each')

const origConsoleError = console.error.bind(console)

console.error = (msg, ...rest) => {
  if (
    msg?.startsWith(
      'Warning: An update to %s inside a test was not wrapped in act',
    )
  ) {
    // https://github.com/facebook/react/issues/14769
    return
  }

  origConsoleError(msg, ...rest)
}

console.warn = jest.fn()
