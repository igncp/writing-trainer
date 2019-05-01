import React from 'react'

import { getSelectedText } from '../../utils/general'

const Panel = () => {
  const selectedText = getSelectedText()

  return (
    <div style={{ border: '1px solid black' }}>
      <h1>This is the Panel Content</h1>
      <h2>{selectedText}</h2>
    </div>
  )
}

export default Panel
