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
    >((acc, 語言UI處理程序) => {
      acc[語言UI處理程序.languageHandler.getId()] = 語言UI處理程序

      return acc
    }, {})

    this.init()
  }

  public getDefaultLanguage() {
    return this.handlers[0]!.languageHandler.getId()
  }

  public init() {
    this.manager.clear()

    this.handlers.forEach(語言UI處理程序 => {
      this.manager.registerLanguage(語言UI處理程序.languageHandler)
    })

    const defaultLanguage = this.getDefaultLanguage()

    this.manager.setCurrentLanguageHandler(defaultLanguage)
  }

  public 獲取語言UI處理程序() {
    const languageHandler = this.manager.getCurrentLanguageHandler()

    if (!languageHandler) {
      throw new Error('No language handler set')
    }

    const 語言UI處理程序 =
      this.idToLanguageUIHandlerMap[languageHandler.getId()]

    if (!語言UI處理程序 as unknown) {
      throw new Error(
        `No UI language handler for language: ${languageHandler.getId()}`,
      )
    }

    return 語言UI處理程序
  }
}

export { LanguageUIManager }
