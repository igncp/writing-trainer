import {
  T_CharObj,
  LanguageDefinition,
  LanguageManager,
  LanguageHandler,
} from '..'

const languageManager = new LanguageManager()

const createDummyLanguageHandler = (
  id: LanguageDefinition['id'],
): LanguageHandler => {
  const 轉換為字元對象列表 = () => {
    const result: T_CharObj[] = []

    return result
  }

  return new LanguageHandler({
    language: new LanguageDefinition({
      id,
      name: 'Some Name',
    }),
    轉換為字元對象列表,
  })
}

const dummyHandlerA = createDummyLanguageHandler('dummyA')
const dummyHandlerB = createDummyLanguageHandler('dummyB')

beforeEach(() => {
  languageManager.clear()
})

describe('registerLanguage', () => {
  it('sets a new language', () => {
    expect(languageManager.getAvailableLangs()).toEqual([])

    languageManager.registerLanguage(dummyHandlerA)

    expect(languageManager.getAvailableLangs()).toEqual([dummyHandlerA.getId()])
  })
})

describe('clear', () => {
  it('can remove a registered language', () => {
    languageManager.registerLanguage(dummyHandlerA)
    languageManager.setCurrentLanguageHandler(dummyHandlerA.getId())

    expect(languageManager.getAvailableLangs()).toEqual([dummyHandlerA.getId()])

    expect(languageManager.getCurrentLanguageHandler()!.getId()).toEqual(
      dummyHandlerA.getId(),
    )

    languageManager.clear()

    expect(languageManager.getCurrentLanguageHandler()).toEqual(null)
    expect(languageManager.getAvailableLangs()).toEqual([])
  })
})

describe('getCurrentLanguageHandler', () => {
  it('returns null when no handlers', () => {
    expect(languageManager.getAvailableLangs()).toEqual([])

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

    expect(languageManager.getAvailableLangs()).toEqual([
      dummyHandlerA.getId(),
      dummyHandlerB.getId(),
    ])

    languageManager.unregisterLanguage(dummyHandlerA.getId())

    expect(languageManager.getAvailableLangs()).toEqual([dummyHandlerB.getId()])
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
