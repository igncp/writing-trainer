import * as writingTrainer from '..'
import { LanguageDefinition } from '../constants'
import { LanguageHandler } from '../languageHandlers/_common'
import { SPECIAL_SYMBOLS } from '../languageHandlers/_commonChars'
import { englishHandler } from '../languageHandlers/english'
import { japaneseHandler } from '../languageHandlers/japanese'
import { mandarinHandler } from '../languageHandlers/mandarin'
import { LanguageManager, CharObj, CurrentCharObj } from '../languageManager'
import { Record } from '../records'

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      CharObj,
      CurrentCharObj,
      LanguageDefinition,
      LanguageHandler,
      LanguageManager,
      Record,
      SPECIAL_SYMBOLS,
      englishHandler,
      japaneseHandler,
      mandarinHandler,
    })
  })
})
