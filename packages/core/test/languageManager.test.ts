import {
  CharObj,
  LanguageDefinition,
  LanguageManager,
  T_LanguageHandler,
} from '../src'

const languageManager = new LanguageManager()

const createDummyLanguageHandler = (
  id: LanguageDefinition['id'],
): T_LanguageHandler => {
  const convertToCharsObjs = () => {
    const result: CharObj[] = []

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
    language: new LanguageDefinition({
      id,
      name: 'Some Name',
    }),
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

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerA.language.id,
    ])
  })
})

describe('clear', () => {
  it('can remove a registered language', () => {
    languageManager.registerLanguage(dummyHandlerA)
    languageManager.setCurrentLanguageHandler(dummyHandlerA.language.id)

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerA.language.id,
    ])

    expect(languageManager.getCurrentLanguageHandler()!.language.id).toEqual(
      dummyHandlerA.language.id,
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

    languageManager.setCurrentLanguageHandler(dummyHandlerA.language.id)

    expect(languageManager.getCurrentLanguageHandler()).toEqual(dummyHandlerA)
  })
})

describe('unregisterLanguage', () => {
  it('removes only the registered language', () => {
    languageManager.registerLanguage(dummyHandlerA)
    languageManager.registerLanguage(dummyHandlerB)

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerA.language.id,
      dummyHandlerB.language.id,
    ])

    languageManager.unregisterLanguage(dummyHandlerA.language.id)

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerB.language.id,
    ])
  })
})

describe('getLanguageHandler', () => {
  it('returns the expected value', () => {
    expect(
      languageManager.getLanguageHandler(dummyHandlerA.language.id),
    ).toEqual(null)

    languageManager.registerLanguage(dummyHandlerA)

    expect(
      languageManager.getLanguageHandler(dummyHandlerA.language.id),
    ).toEqual(dummyHandlerA)
    expect(languageManager.getLanguageHandler('foo')).toEqual(null)

    languageManager.unregisterLanguage(dummyHandlerA.language.id)

    expect(
      languageManager.getLanguageHandler(dummyHandlerA.language.id),
    ).toEqual(null)
  })
})
