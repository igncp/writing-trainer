import { T_LanguageDefinition } from './constants'

interface T_CharObj {
  pronunciation: string
  word: string
}

type T_convertToCharsObjs = (opts: {
  text: string
  charsToRemove: string[]
  langOpts?: { [k: string]: unknown }
}) => T_CharObj[]

type T_filterTextToPractice = (opts: {
  text: string
  charsToRemove: string[]
}) => string

type T_CurrentCharObj = { ch: T_CharObj | null; index: number }

type T_getCurrentCharObj = (opts: {
  originalCharsObjs: T_CharObj[]
  practiceCharsObjs: T_CharObj[]
}) => T_CurrentCharObj | null

interface T_LanguageHandler {
  convertToCharsObjs: T_convertToCharsObjs
  /**
   * Given a certain text from the user, filter characters out to match with the pronunciation
   */
  filterTextToPractice: T_filterTextToPractice
  getCurrentCharObj: T_getCurrentCharObj
  getSpecialChars(): string[]
  id: T_LanguageDefinition['id']
  name: T_LanguageDefinition['name']
}

class LanguageManager {
  private languages: T_LanguageHandler[] = []
  private currentLanguageHandlerId: T_LanguageDefinition['id'] | null = null

  private getLanguagesIds() {
    return this.languages.map((l) => l.id)
  }

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
    return this.languages.find((l) => l.id === id) || null
  }
  public registerLanguage(lang: T_LanguageHandler) {
    this.languages.push(lang)
  }
  public setCurrentLanguageHandler(v: string) {
    this.currentLanguageHandlerId = v
  }
  public unregisterLanguage(langId: string) {
    this.languages = this.languages.filter((l) => l.id !== langId)
  }
}

export {
  LanguageManager,
  T_CharObj,
  T_CurrentCharObj,
  T_LanguageHandler,
  T_convertToCharsObjs,
  T_filterTextToPractice,
  T_getCurrentCharObj,
}
