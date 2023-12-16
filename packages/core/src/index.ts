/* istanbul ignore file */
import {
  LanguageDefinition,
  T_Storage,
  unknownPronunciation,
} from './constants'
import { LanguageHandler } from './languageHandlers/_common'
import { SPECIAL_SYMBOLS } from './languageHandlers/_commonChars'
import { cantoneseHandler } from './languageHandlers/cantonese'
import { englishHandler } from './languageHandlers/english'
import { japaneseHandler } from './languageHandlers/japanese'
import { mandarinHandler } from './languageHandlers/mandarin'
import { CharObj, CurrentCharObj, LanguageManager } from './languageManager'
import { Record } from './records'

export {
  CharObj,
  CurrentCharObj,
  LanguageDefinition,
  LanguageHandler,
  LanguageManager,
  Record,
  SPECIAL_SYMBOLS,
  T_Storage,
  cantoneseHandler,
  englishHandler,
  japaneseHandler,
  mandarinHandler,
  unknownPronunciation,
}
