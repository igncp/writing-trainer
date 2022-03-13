/* istanbul ignore file */
import { LanguageDefinition, T_Storage } from './constants'
import { SPECIAL_SYMBOLS } from './languageHandlers/_commonChars'
import { englishHandler } from './languageHandlers/english'
import { japaneseHandler } from './languageHandlers/japanese'
import { mandarinHandler } from './languageHandlers/mandarin'
import {
  CharObj,
  CurrentCharObj,
  LanguageManager,
  T_LanguageHandler,
} from './languageManager'
import { Record } from './records'

export {
  CharObj,
  CurrentCharObj,
  LanguageDefinition,
  LanguageManager,
  Record,
  SPECIAL_SYMBOLS,
  T_LanguageHandler,
  T_Storage,
  englishHandler,
  japaneseHandler,
  mandarinHandler,
}
