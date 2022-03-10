import { T_LanguageId } from '../constants'
import {
  LanguageManager,
  T_CharObj,
  T_LanguageHandler,
} from '../languageManager'

const languageManager = new LanguageManager()

const createDummyLanguageHandler = (id: T_LanguageId): T_LanguageHandler => {
  const convertToCharsObjs = () => {
    const result: T_CharObj[] = []

    return result
  }

  const filterTextToPractice = () => {
    return ''
  }

  const getSpecialChars = () => {
    const result: string[] = []

    return result
  }

  const getCurrentCharObj = (): null => null

  return {
    convertToCharsObjs,
    filterTextToPractice,
    getCurrentCharObj,
    getSpecialChars,
    id,
    name: 'Some Name',
  }
}

const dummyHandlerA = createDummyLanguageHandler('dummyA')
const dummyHandlerB = createDummyLanguageHandler('dummyB')

beforeEach(() => {
  languageManager.clear()
})

describe('registerLanguage', () => {
  it('sets a new language', () => {
    expect(languageManager.getAvailableLanguages()).toEqual([])

    languageManager.registerLanguage(dummyHandlerA)

    expect(languageManager.getAvailableLanguages()).toEqual([dummyHandlerA.id])
  })
})

describe('clear', () => {
  it('can remove a registered language', () => {
    languageManager.registerLanguage(dummyHandlerA)
    languageManager.setCurrentLanguageHandler(dummyHandlerA.id)

    expect(languageManager.getAvailableLanguages()).toEqual([dummyHandlerA.id])

    expect(languageManager.getCurrentLanguageHandler().id).toEqual(
      dummyHandlerA.id
    )

    languageManager.clear()

    expect(languageManager.getCurrentLanguageHandler()).toEqual(null)
    expect(languageManager.getAvailableLanguages()).toEqual([])
  })
})

describe('getCurrentLanguageHandler', () => {
  it('returns null when no handlers', () => {
    expect(languageManager.getAvailableLanguages()).toEqual([])

    expect(languageManager.getCurrentLanguageHandler()).toEqual(null)
  })

  it('returns null when no matched', () => {
    languageManager.registerLanguage(dummyHandlerA)

    expect(languageManager.getCurrentLanguageHandler()).toEqual(null)

    languageManager.setCurrentLanguageHandler('foo')

    expect(languageManager.getCurrentLanguageHandler()).toEqual(null)

    languageManager.setCurrentLanguageHandler(dummyHandlerA.id)

    expect(languageManager.getCurrentLanguageHandler()).toEqual(dummyHandlerA)
  })
})

describe('unregisterLanguage', () => {
  it('removes only the registered language', () => {
    languageManager.registerLanguage(dummyHandlerA)
    languageManager.registerLanguage(dummyHandlerB)

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerA.id,
      dummyHandlerB.id,
    ])

    languageManager.unregisterLanguage(dummyHandlerA.id)

    expect(languageManager.getAvailableLanguages()).toEqual([dummyHandlerB.id])
  })
})

describe('getLanguageHandler', () => {
  it('returns the expected value', () => {
    expect(languageManager.getLanguageHandler(dummyHandlerA.id)).toEqual(null)

    languageManager.registerLanguage(dummyHandlerA)

    expect(languageManager.getLanguageHandler(dummyHandlerA.id)).toEqual(
      dummyHandlerA
    )
    expect(languageManager.getLanguageHandler('foo')).toEqual(null)

    languageManager.unregisterLanguage(dummyHandlerA.id)

    expect(languageManager.getLanguageHandler(dummyHandlerA.id)).toEqual(null)
  })
})
