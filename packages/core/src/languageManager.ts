import { LanguageDefinition } from './constants'

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

type T_convertToCharsObjs = (opts: {
  text: string
  charsToRemove: string[]
  langOpts?: { [k: string]: unknown }
}) => CharObj[]

type T_filterTextToPractice = (opts: {
  text: string
  charsToRemove: string[]
}) => string

type T_getCurrentCharObj = (opts: {
  originalCharsObjs: CharObj[]
  practiceCharsObjs: CharObj[]
}) => CurrentCharObj | null

interface T_LanguageHandler {
  convertToCharsObjs: T_convertToCharsObjs
  /**
   * Given a certain text from the user, filter characters out to match with the pronunciation
   */
  filterTextToPractice: T_filterTextToPractice
  getCurrentCharObj: T_getCurrentCharObj
  getSpecialChars: () => string[]
  language: LanguageDefinition
}

class LanguageManager {
  private languages: T_LanguageHandler[] = []
  private currentLanguageHandlerId: LanguageDefinition['id'] | null = null

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
    return this.languages.find(l => l.language.id === id) ?? null
  }

  public registerLanguage(lang: T_LanguageHandler) {
    this.languages.push(lang)
  }

  public setCurrentLanguageHandler(v: string) {
    this.currentLanguageHandlerId = v
  }

  public unregisterLanguage(langId: string) {
    this.languages = this.languages.filter(l => l.language.id !== langId)
  }

  private getLanguagesIds() {
    return this.languages.map(l => l.language.id)
  }
}

export { CharObj, CurrentCharObj, LanguageManager, T_LanguageHandler }
