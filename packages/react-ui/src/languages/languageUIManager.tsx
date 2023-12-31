import { LanguageManager } from 'writing-trainer-core'

import { uiHandlers as defaultUIHandlers } from './handlers'
import { T_UIHandler } from './types'

class LanguageUIManager {
  private readonly handlers: T_UIHandler[]
  private readonly idToLanguageUIHandlerMap: { [k: string]: T_UIHandler } = {}
  private readonly manager: LanguageManager

  public constructor(manager: LanguageManager, handlers?: T_UIHandler[]) {
    this.manager = manager
    this.handlers = handlers ?? defaultUIHandlers

    if (this.handlers.length === 0) {
      throw new Error('No UI handlers provided')
    }

    this.idToLanguageUIHandlerMap = this.handlers.reduce<
      LanguageUIManager['idToLanguageUIHandlerMap']
    >((acc, uiHandler) => {
      acc[uiHandler.languageHandler.getId()] = uiHandler

      return acc
    }, {})

    this.init()
  }

  public getDefaultLanguage() {
    return this.handlers[0]!.languageHandler.getId()
  }

  public getUIHandler() {
    const languageHandler = this.manager.getCurrentLanguageHandler()

    if (!languageHandler as unknown) {
      throw new Error('No language handler set')
    }

    const uiHandler = this.idToLanguageUIHandlerMap[languageHandler!.getId()]

    if (!uiHandler as unknown) {
      throw new Error(
        `No UI language handler for language: ${languageHandler!.getId()}`,
      )
    }

    return uiHandler
  }

  public init() {
    this.manager.clear()

    this.handlers.forEach(uiHandler => {
      this.manager.registerLanguage(uiHandler.languageHandler)
    })

    const defaultLanguage = this.getDefaultLanguage()

    this.manager.setCurrentLanguageHandler(defaultLanguage)
  }
}

export { LanguageUIManager }
