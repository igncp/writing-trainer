import { LanguageManager } from 'writing-trainer-core'

import { uiHandlers } from '../handlers'
import { LanguageUIManager } from '../languageUIManager'

const languageManager = new LanguageManager()
const languageUIManager = new LanguageUIManager(languageManager, uiHandlers)

beforeEach(() => {
  languageManager.clear()
  jest.spyOn(languageManager, 'clear')
})

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(languageManager.clear as any).mockRestore()
})

describe('init', () => {
  it('populates the language manager', () => {
    expect((languageManager.clear as any).mock.calls).toEqual([])
    expect(languageManager.getAvailableLanguages()).toEqual([])
    expect(languageManager.getCurrentLanguageHandler()).toEqual(null)

    languageUIManager.init()

    expect((languageManager.clear as any).mock.calls).toEqual([[]])
    expect(languageManager.getAvailableLanguages()).not.toEqual([])
    expect(languageManager.getCurrentLanguageHandler()).not.toEqual(null)
  })
})

describe('getUIHandler', () => {
  it('throws when no handler is set', () => {
    expect(() => languageUIManager.getUIHandler()).toThrow(
      'No language handler set',
    )
  })

  it('returns the UI handler with same id as the current language handler', () => {
    languageUIManager.init()

    expect(languageUIManager.getUIHandler().id).toEqual(
      languageManager.getCurrentLanguageHandler()!.language.id,
    )
  })
})

describe('getDefaultLanguage', () => {
  it('returns the first id of the array', () => {
    expect(languageUIManager.getDefaultLanguage()).toEqual(uiHandlers[0].id)
  })
})
