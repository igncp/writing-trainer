import React from 'react'
import ReactDOM from 'react-dom'
import { main as mainCore } from 'writing-trainer-core'

import Content from '#/containers/Content/Content'
import log from '#/services/log'

// eslint-disable-next-line no-console
console.debug(mainCore())

const main = () => {
  const div = document.createElement('div')

  document.body.prepend(div)

  ReactDOM.render(
    <Content
      onContentEnabledResult={result => {
        log('ENABLED', result)
      }}
    />,
    div
  )
}

setTimeout(main, 100)
