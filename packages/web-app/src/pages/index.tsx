import React from 'react'
import { Panel, useBodyOverflowSwitch } from 'writing-trainer-react-ui'

import {
  languageManager,
  languageUIManager,
  panelServices,
  usedText,
} from '../utils'

const PANEL_UI = {
  noHideButton: true,
}

const shouldShowPanel = true

const IndexPage = () => {
  useBodyOverflowSwitch(shouldShowPanel)

  return (
    <div>
      <h1>Writing Trainer</h1>
      <div style={{ position: 'relative' }}>
        <Panel
          UI={PANEL_UI}
          languageManager={languageManager}
          languageUIManager={languageUIManager}
          services={panelServices}
          text={usedText}
        />
      </div>
    </div>
  )
}

export default IndexPage
