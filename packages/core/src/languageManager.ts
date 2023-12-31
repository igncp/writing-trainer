import { LanguageDefinition } from './constants'
import { LanguageHandler } from './languageHandlers/_common'

class CharObj {
  public readonly pronunciation: string
  public readonly word: string // @TODO: rename to "text"

  public constructor(opt: {
    pronunciation: CharObj['pronunciation']
    word: CharObj['word']
  }) {
    this.pronunciation = opt.pronunciation
    this.word = opt.word
  }
}

class CurrentCharObj {
  public readonly ch: CharObj
  public readonly index: number
  public constructor(opts: { ch: CharObj; index: number }) {
    this.ch = opts.ch
    this.index = opts.index
  }
}

class LanguageManager {
  private currentLanguageHandlerId: LanguageDefinition['id'] | null = null
  private languages: LanguageHandler[] = []

  public clear() {
    this.languages.length = 0
    this.currentLanguageHandlerId = null
  }

  public getAvailableLanguages() {
    return this.getLanguagesIds()
  }

  public getCurrentLanguageHandler() {
    if (!this.currentLanguageHandlerId) {
      return null
    }

    const languagesIds = this.getLanguagesIds()

    const idx = languagesIds.indexOf(this.currentLanguageHandlerId)

    return idx !== -1 ? this.languages[idx] : null
  }

  public getLanguageHandler(id: string) {
    return this.languages.find(l => l.getId() === id) ?? null
  }

  private getLanguagesIds() {
    return this.languages.map(l => l.getId())
  }

  public registerLanguage(lang: LanguageHandler) {
    this.languages.push(lang)
  }

  public setCurrentLanguageHandler(v: string) {
    this.currentLanguageHandlerId = v
  }

  public unregisterLanguage(langId: string) {
    this.languages = this.languages.filter(l => l.getId() !== langId)
  }
}

export { CharObj, CurrentCharObj, LanguageManager }
