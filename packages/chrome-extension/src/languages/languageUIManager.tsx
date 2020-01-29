import { languageManager } from 'writing-trainer-core'

import { T_UIHandler, T_LanguageId } from '#/languages/types'

import englishUIHandler from './english/english'
import mandarinUIHandler from './mandarin/mandarin'
import japaneseUIHandler from './japanese/japanese'

const languageUIHandlers = [
  englishUIHandler,
  mandarinUIHandler,
  japaneseUIHandler,
]

type T_IdToLanguageUIHandlerMap = { [k: string]: T_UIHandler }

const idToLanguageUIHandlerMap: T_IdToLanguageUIHandlerMap = languageUIHandlers.reduce(
  (acc, uiHandler) => {
    acc[uiHandler.id] = uiHandler

    return acc
  },
  {} as T_IdToLanguageUIHandlerMap
)

interface T_LanguageUIManager {
  getDefaultLanguage(): T_LanguageId
  getUIHandler(): T_UIHandler
  init(): void
}

const languageUIManager: T_LanguageUIManager = {
  getDefaultLanguage: () => {
    return languageUIHandlers[0]!.id
  },
  getUIHandler: () => {
    const languageHandler = languageManager.getCurrentLanguageHandler()

    if (!languageHandler) {
      throw new Error('No language handler set')
    }

    const uiHandler = idToLanguageUIHandlerMap[languageHandler.id]

    if (!uiHandler) {
      throw new Error(
        `No UI language handler for language: ${languageHandler.id}`
      )
    }

    return uiHandler
  },
  init: () => {
    languageManager.clear()

    languageUIHandlers.forEach(uiHandler => {
      uiHandler.register()
    })
    const defaultLanguage = languageUIManager.getDefaultLanguage()

    languageManager.setCurrentLanguageHandler(defaultLanguage)
  },
}

let _test:
  | undefined
  | {
      languageUIHandlers: T_UIHandler[]
    }

// istanbuil ignore else
if (__TEST__) {
  _test = {
    languageUIHandlers,
  }
}

export { _test }

export default languageUIManager
