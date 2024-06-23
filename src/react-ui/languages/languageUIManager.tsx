import { LanguageManager } from '#/core'

import { 語言UI處理程序清單 as 預設語言UI處理程序清單 } from './handlers'
import { 類型_語言UI處理程序 } from './types'

class LanguageUIManager {
  private readonly handlers: 類型_語言UI處理程序[]
  private readonly idToLanguageUIHandlerMap: {
    [k: string]: 類型_語言UI處理程序
  } = {}

  private readonly manager: LanguageManager

  public constructor(
    manager: LanguageManager,
    handlers?: 類型_語言UI處理程序[],
  ) {
    this.manager = manager
    this.handlers = handlers ?? 預設語言UI處理程序清單

    if (this.handlers.length === 0) {
      throw new Error('No UI handlers provided')
    }

    this.idToLanguageUIHandlerMap = this.handlers.reduce<
      LanguageUIManager['idToLanguageUIHandlerMap']
    >((acc, languageUIController) => {
      acc[languageUIController.languageHandler.getId()] = languageUIController

      return acc
    }, {})

    this.init()
  }

  public getDefaultLanguage() {
    return this.handlers[0]!.languageHandler.getId()
  }

  public getLanguageUIController() {
    const languageHandler = this.manager.getCurrentLanguageHandler()

    if (!languageHandler) {
      throw new Error('No language handler set')
    }

    const languageUIController =
      this.idToLanguageUIHandlerMap[languageHandler.getId()]

    if (!languageUIController as unknown) {
      throw new Error(
        `No UI language handler for language: ${languageHandler.getId()}`,
      )
    }

    return languageUIController
  }

  public init() {
    this.manager.clear()

    this.handlers.forEach(languageUIController => {
      this.manager.registerLanguage(languageUIController.languageHandler)
    })

    const defaultLanguage = this.getDefaultLanguage()

    this.manager.setCurrentLanguageHandler(defaultLanguage)
  }
}

export { LanguageUIManager }
