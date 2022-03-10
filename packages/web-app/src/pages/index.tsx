import React from "react"
import Panel from "writing-trainer-react-ui/dist/containers/Panel/Panel"
import { useBodyOverflowSwitch } from "writing-trainer-react-ui/dist/utils/hooks"
import { LanguageUIManager } from "writing-trainer-react-ui/dist/languages/languageUIManager"
import { LanguageManager } from "writing-trainer-core/dist"

const languageManager = new LanguageManager()
const languageUIManager = new LanguageUIManager(languageManager)
languageUIManager.init()

const shouldShowPanel = true
const usedText = "foo bar"

const getCurrentUrl = () => Promise.resolve("")
const storage = {
  getValue: () => Promise.resolve(""),
  setValue: () => {}
}

const panelServices = {
  getCurrentUrl,
  storage
}

const PANEL_UI = {
  noHideButton: true
}

const IndexPage = () => {
  useBodyOverflowSwitch(shouldShowPanel)

  return (
    <div>
      <h1>Writing Trainer</h1>
      <div style={{ position: "relative" }}>
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
