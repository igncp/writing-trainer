import React from 'react'
import ReactDOM from 'react-dom'

import Content from '@/containers/Content/Content'
import log from '@/services/log'

const main = () => {
  const div = document.createElement('div')

  document.body.prepend(div)

  ReactDOM.render(
    <Content
      onContentEnabledResult={result => {
        log('ENABLED', result)
      }}
    />,
    div,
  )
}

setTimeout(main, 100)
