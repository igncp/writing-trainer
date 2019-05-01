import React from 'react'
import ReactDOM from 'react-dom'

import App from './containers/App/App'

const main = () => {
  const div = document.createElement('div')

  document.body.prepend(div)

  ReactDOM.render(<App />, div)
}

export default main
