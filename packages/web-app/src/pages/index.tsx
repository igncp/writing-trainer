import React from 'react'
import { LanguageManager } from 'writing-trainer-core'
import {
  LanguageUIManager,
  Panel,
  useBodyOverflowSwitch,
} from 'writing-trainer-react-ui'

const languageManager = new LanguageManager()
const languageUIManager = new LanguageUIManager(languageManager)
languageUIManager.init()

const shouldShowPanel = true
const usedText = 'foo bar'

const getCurrentUrl = () => Promise.resolve('')
const storage = {
  getValue: () => Promise.resolve(''),
  setValue: () => {},
}

const panelServices = {
  getCurrentUrl,
  storage,
}

const PANEL_UI = {
  noHideButton: true,
}

const IndexPage = () => {
  useBodyOverflowSwitch(shouldShowPanel)

  return (
    <div>
      <h1>Writing Trainer</h1>
      <div style={{ position: 'relative' }}>
        <Panel
          UI={PANEL_UI}
          services={panelServices}
          text={usedText}
          languageManager={languageManager}
          languageUIManager={languageUIManager}
        />
      </div>
    </div>
  )
}

export default IndexPage
