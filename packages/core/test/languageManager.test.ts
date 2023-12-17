import {
  CharObj,
  LanguageDefinition,
  LanguageManager,
  LanguageHandler,
} from '../src'

const languageManager = new LanguageManager()

const createDummyLanguageHandler = (
  id: LanguageDefinition['id'],
): LanguageHandler => {
  const convertToCharsObjs = () => {
    const result: CharObj[] = []

    return result
  }

  return new LanguageHandler({
    convertToCharsObjs,
    language: new LanguageDefinition({
      id,
      name: 'Some Name',
    }),
  })
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
      dummyHandlerA.getId(),
    ])
  })
})

describe('clear', () => {
  it('can remove a registered language', () => {
    languageManager.registerLanguage(dummyHandlerA)
    languageManager.setCurrentLanguageHandler(dummyHandlerA.getId())

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerA.getId(),
    ])

    expect(languageManager.getCurrentLanguageHandler()!.getId()).toEqual(
      dummyHandlerA.getId(),
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

    languageManager.setCurrentLanguageHandler(dummyHandlerA.getId())

    expect(languageManager.getCurrentLanguageHandler()).toEqual(dummyHandlerA)
  })
})

describe('unregisterLanguage', () => {
  it('removes only the registered language', () => {
    languageManager.registerLanguage(dummyHandlerA)
    languageManager.registerLanguage(dummyHandlerB)

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerA.getId(),
      dummyHandlerB.getId(),
    ])

    languageManager.unregisterLanguage(dummyHandlerA.getId())

    expect(languageManager.getAvailableLanguages()).toEqual([
      dummyHandlerB.getId(),
    ])
  })
})

describe('getLanguageHandler', () => {
  it('returns the expected value', () => {
    expect(languageManager.getLanguageHandler(dummyHandlerA.getId())).toEqual(
      null,
    )

    languageManager.registerLanguage(dummyHandlerA)

    expect(languageManager.getLanguageHandler(dummyHandlerA.getId())).toEqual(
      dummyHandlerA,
    )
    expect(languageManager.getLanguageHandler('foo')).toEqual(null)

    languageManager.unregisterLanguage(dummyHandlerA.getId())

    expect(languageManager.getLanguageHandler(dummyHandlerA.getId())).toEqual(
      null,
    )
  })
})