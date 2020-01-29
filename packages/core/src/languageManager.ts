import { T_LanguageDefinition, T_LanguageId } from './constants'

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

interface T_LanguageHandler {
  id: T_LanguageDefinition['id']
  name: T_LanguageDefinition['name']
  convertToCharsObjs: T_convertToCharsObjs
  /**
   * Given a certain text from the user, filter characters out to match with the pronunciation
   */
  filterTextToPractice: T_filterTextToPractice
  getSpecialChars(): string[]
}

interface T_LanguageManager {
  clear(): void
  getAvailableLanguages(): T_LanguageId[]
  getCurrentLanguageHandler(): T_LanguageHandler | null
  getLanguageHandler(id: T_LanguageId): T_LanguageHandler | null
  registerLanguage(handler: T_LanguageHandler): void
  setCurrentLanguageHandler(id: T_LanguageId): void
  unregisterLanguage(id: T_LanguageId): void
}

const createLanguageManager = (): T_LanguageManager => {
  let languages: T_LanguageHandler[] = []
  let currentLanguageHandlerId: string | null = null

  const getLanguagesIds = () => languages.map(l => l.id)

  return {
    clear: () => {
      languages.length = 0
      currentLanguageHandlerId = null
    },
    getAvailableLanguages: () => {
      return getLanguagesIds()
    },
    getCurrentLanguageHandler: () => {
      if (!currentLanguageHandlerId) {
        return null
      }

      const languagesIds = getLanguagesIds()

      const idx = languagesIds.indexOf(currentLanguageHandlerId)

      return idx !== -1 ? languages[idx] : null
    },
    getLanguageHandler: id => {
      return languages.find(l => l.id === id) || null
    },
    registerLanguage: lang => {
      languages.push(lang)
    },
    setCurrentLanguageHandler: v => {
      currentLanguageHandlerId = v
    },
    unregisterLanguage: langId => {
      languages = languages.filter(l => l.id !== langId)
    },
  }
}

const languageManager = createLanguageManager()

export {
  T_CharObj,
  T_LanguageHandler,
  T_LanguageManager,
  T_convertToCharsObjs,
  T_filterTextToPractice,
  languageManager,
}
