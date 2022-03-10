import { LanguageManager } from 'writing-trainer-core'

import { T_UIHandler } from './types'

import englishUIHandler from './english/english'
import mandarinUIHandler from './mandarin/mandarin'
import japaneseUIHandler from './japanese/japanese'

// @TODO: completely remove this default when not used.
// Consumer apps should pass this instead of using a default.
const defaultLanguageUIHandlers = [
  englishUIHandler,
  mandarinUIHandler,
  japaneseUIHandler,
]

class LanguageUIManager {
  private manager: LanguageManager
  private handlers: T_UIHandler[]
  private idToLanguageUIHandlerMap: { [k: string]: T_UIHandler } = {}

  constructor(manager: LanguageManager, handlers?: T_UIHandler[]) {
    this.manager = manager
    this.handlers = handlers ?? defaultLanguageUIHandlers

    if (this.handlers.length === 0) {
      throw new Error('No UI handlers provided')
    }

    this.idToLanguageUIHandlerMap = defaultLanguageUIHandlers.reduce<
      LanguageUIManager['idToLanguageUIHandlerMap']
    >((acc, uiHandler) => {
      acc[uiHandler.id] = uiHandler

      return acc
    }, {})
  }

  public getDefaultLanguage() {
    return this.handlers[0]!.id
  }

  public getUIHandler() {
    const languageHandler = this.manager.getCurrentLanguageHandler()

    if (!languageHandler) {
      throw new Error('No language handler set')
    }

    const uiHandler = this.idToLanguageUIHandlerMap[languageHandler.id]

    if (!uiHandler) {
      throw new Error(
        `No UI language handler for language: ${languageHandler.id}`
      )
    }

    return uiHandler
  }

  public init() {
    this.manager.clear()

    this.handlers.forEach((uiHandler) => {
      uiHandler.register(this.manager)
    })

    const defaultLanguage = this.getDefaultLanguage()

    this.manager.setCurrentLanguageHandler(defaultLanguage)
  }
}

let _test:
  | undefined
  | {
      defaultLanguageUIHandlers: T_UIHandler[]
    }

// istanbuil ignore else
if (__TEST__) {
  _test = {
    defaultLanguageUIHandlers,
  }
}

export { _test, LanguageUIManager }
