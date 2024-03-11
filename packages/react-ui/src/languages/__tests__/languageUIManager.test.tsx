import { LanguageManager } from 'writing-trainer-core'

import { 語言UI處理程序清單 } from '../handlers'
import { LanguageUIManager } from '../languageUIManager'

const languageManager = new LanguageManager()

beforeEach(() => {
  languageManager.clear()
  jest.spyOn(languageManager, 'clear')
})

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  ;(languageManager.clear as any).mockRestore()
})

describe('constructor', () => {
  it('populates the language manager', () => {
    expect((languageManager.clear as any).mock.calls).toEqual([])
    expect(languageManager.取得可用語言()).toEqual([])
    expect(languageManager.getCurrentLanguageHandler()).toEqual(null)

    new LanguageUIManager(languageManager, 語言UI處理程序清單)

    expect((languageManager.clear as any).mock.calls).toEqual([[]])
    expect(languageManager.取得可用語言()).not.toEqual([])
    expect(languageManager.getCurrentLanguageHandler()).not.toEqual(null)
  })
})

describe('獲取語言UI處理程序', () => {
  it('returns the UI handler with same id as the current language handler', () => {
    const languageUIManager = new LanguageUIManager(
      languageManager,
      語言UI處理程序清單,
    )

    expect(
      languageUIManager.獲取語言UI處理程序().languageHandler.getId(),
    ).toEqual(languageManager.getCurrentLanguageHandler()!.getId())
  })
})

describe('getDefaultLanguage', () => {
  it('returns the first id of the array', () => {
    const languageUIManager = new LanguageUIManager(
      languageManager,
      語言UI處理程序清單,
    )

    expect(languageUIManager.getDefaultLanguage()).toEqual(
      語言UI處理程序清單[0].languageHandler.getId(),
    )
  })
})
