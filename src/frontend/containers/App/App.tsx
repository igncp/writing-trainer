import React, { useState } from 'react'

import { useTextSelection } from '../../utils/hooks'

import PanelTrigger from '../../components/PanelTrigger/PanelTrigger'

import Panel from '../Panel/Panel'

const App = () => {
  const [shouldShowPanel, showPanel] = useState(false)
  const [usedText, setUsedText] = useState('')

  useTextSelection(textSelected => {
    const parsedText = textSelected.trim()

    if (parsedText !== '' && !shouldShowPanel) {
      setUsedText(parsedText)
    }
  })

  if (!shouldShowPanel && usedText) {
    return <PanelTrigger onClick={() => showPanel(true)} />
  } else if (!usedText) {
    return null
  }

  return <Panel text={usedText} onHideRequest={() => showPanel(false)} />
}

export default App
