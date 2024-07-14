/* istanbul ignore file */
import {
  LanguageDefinition,
  T_Storage,
  unknownPronunciation,
} from './constants'
import { LanguageHandler } from './languageHandlers/_common'
import { specialChars } from './languageHandlers/_特殊字元'
import { cantoneseHandler } from './languageHandlers/cantonese'
import { englishHandler } from './languageHandlers/english'
import { japaneseHandler } from './languageHandlers/japanese'
import { mandarinHandler } from './languageHandlers/mandarin'
import { T_CharObj, CurrentCharObj, LanguageManager } from './languageManager'
import { Record } from './records'

export {
  cantoneseHandler,
  CurrentCharObj,
  englishHandler,
  japaneseHandler,
  LanguageDefinition,
  LanguageHandler,
  LanguageManager,
  mandarinHandler,
  Record,
  specialChars,
  T_CharObj,
  type T_Storage,
  unknownPronunciation,
}
