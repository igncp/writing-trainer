import { LanguageManager, T_Storage } from 'writing-trainer-core'
import { LanguageUIManager, uiHandlers } from 'writing-trainer-react-ui'

import { siteUrl } from './constants'

const usedText = '忘掉種過的花, 重新的出發, 放棄理想吧'
// Make sure that the first handler is for mandarin
const newUIHandlers = [
  ...uiHandlers.filter(
    handler => handler.languageHandler.getId() === 'mandarin',
  ),
  ...uiHandlers.filter(
    handler => handler.languageHandler.getId() !== 'mandarin',
  ),
]

const languageManager = new LanguageManager()
const languageUIManager = new LanguageUIManager(languageManager, newUIHandlers)

const getCurrentUrl = () => Promise.resolve(siteUrl)
const storage: T_Storage = {
  getValue: (key: string) => Promise.resolve(localStorage.getItem(key) ?? ''),
  setValue: (key: string, value: string) => localStorage.setItem(key, value),
}

const panelServices = {
  getCurrentUrl,
  storage,
}

export { languageManager, languageUIManager, panelServices, usedText }