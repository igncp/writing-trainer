import Options from '#/containers/Options/Options'
import React from 'react'
import ReactDOM from 'react-dom'

const main = () => {
  const div = document.createElement('div')

  document.body.prepend(div)

  ReactDOM.render(<Options />, div)
}

setTimeout(main, 100)
