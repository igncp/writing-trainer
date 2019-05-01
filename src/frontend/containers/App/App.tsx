import React, { useState } from 'react'

import { useTextSelection } from '../../utils/hooks'

import Panel from '../Panel/Panel'

const App = () => {
  const [shouldShowPanel, showPanel] = useState(false)
  const [usedText, setUsedText] = useState('')

  useTextSelection(textSelected => {
    const parsedText = textSelected.trim()

    if (parsedText !== '' && !shouldShowPanel) {
      setUsedText(parsedText)
      showPanel(true)
    }
  })

  if (!shouldShowPanel) {
    return null
  }

  return <Panel text={usedText} onHideRequest={() => showPanel(false)} />
}

export default App
