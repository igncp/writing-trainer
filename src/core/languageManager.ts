import { LanguageDefinition } from './constants'
import { LanguageHandler } from './languageHandlers/_common'

class T_CharObj {
  public readonly pronunciation: string
  public readonly word: string // @TODO: rename to "text"

  public constructor(opt: {
    pronunciation: T_CharObj['pronunciation']
    word: T_CharObj['word']
  }) {
    this.pronunciation = opt.pronunciation
    this.word = opt.word
  }
}

class CurrentCharObj {
  public readonly ch: T_CharObj
  public readonly index: number
  public constructor(opts: { ch: T_CharObj; index: number }) {
    this.ch = opts.ch
    this.index = opts.index
  }
}

class LanguageManager {
  public currentLanguageHandlerId: LanguageDefinition['id'] | null = null
  private langsList: LanguageHandler[] = []

  public clear() {
    this.langsList.length = 0
    this.currentLanguageHandlerId = null
  }

  public getAvailableLangs() {
    return this.getLangsIds()
  }

  public getCurrentLanguageHandler() {
    if (!this.currentLanguageHandlerId) {
      return null
    }

    const languagesIds = this.getLangsIds()

    const idx = languagesIds.indexOf(this.currentLanguageHandlerId)

    return idx !== -1 ? this.langsList[idx] : null
  }

  private getLangsIds() {
    return this.langsList.map(語言 => 語言.getId())
  }

  public getLanguageHandler(id: string) {
    return this.langsList.find(語言 => 語言.getId() === id) ?? null
  }

  public registerLanguage(語言: LanguageHandler) {
    this.langsList.push(語言)
  }

  public setCurrentLanguageHandler(v: string) {
    this.currentLanguageHandlerId = v
  }

  public unregisterLanguage(langId: string) {
    this.langsList = this.langsList.filter(語言 => 語言.getId() !== langId)
  }
}

export { CurrentCharObj, LanguageManager, T_CharObj }
