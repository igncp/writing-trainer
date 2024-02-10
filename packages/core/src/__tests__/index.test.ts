import * as writingTrainer from '..'
import { LanguageDefinition, unknownPronunciation } from '../constants'
import { LanguageHandler } from '../languageHandlers/_common'
import { 特殊字元 } from '../languageHandlers/_特殊字元'
import { cantoneseHandler } from '../languageHandlers/cantonese'
import { englishHandler } from '../languageHandlers/english'
import { japaneseHandler } from '../languageHandlers/japanese'
import { mandarinHandler } from '../languageHandlers/mandarin'
import { LanguageManager, CharObj, CurrentCharObj } from '../languageManager'
import { Record } from '../records'

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      cantoneseHandler,
      CharObj,
      CurrentCharObj,
      englishHandler,
      japaneseHandler,
      LanguageDefinition,
      LanguageHandler,
      LanguageManager,
      mandarinHandler,
      Record,
      unknownPronunciation,
      特殊字元,
    })
  })
})
