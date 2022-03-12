import Content from '#/containers/Content/Content'
import log from '#/services/log'
import React from 'react'
import ReactDOM from 'react-dom'

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
