import React from 'react'
import ReactDOM from 'react-dom'

import App from '#/containers/App/App'
import log from '#/services/log'

const main = () => {
  const div = document.createElement('div')

  document.body.prepend(div)

  ReactDOM.render(
    <App
      onAppEnabledResult={result => {
        log('ENABLED', result)
      }}
    />,
    div
  )
}

setTimeout(main, 100)
