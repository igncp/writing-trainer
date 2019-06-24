import React from 'react'
import ReactDOM from 'react-dom'

import Popup from '#/containers/Popup/Popup'

const main = () => {
  const div = document.createElement('div')

  document.body.prepend(div)

  ReactDOM.render(<Popup />, div)
}

setTimeout(main, 100)
