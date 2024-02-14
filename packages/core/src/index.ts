/* istanbul ignore file */
import {
  LanguageDefinition,
  T_Storage,
  unknownPronunciation,
} from './constants'
import { LanguageHandler } from './languageHandlers/_common'
import { 特殊字元 } from './languageHandlers/_特殊字元'
import { cantoneseHandler } from './languageHandlers/cantonese'
import { englishHandler } from './languageHandlers/english'
import { japaneseHandler } from './languageHandlers/japanese'
import { mandarinHandler } from './languageHandlers/mandarin'
import {
  字元對象類別,
  CurrentCharObj,
  LanguageManager,
} from './languageManager'
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
  T_Storage,
  unknownPronunciation,
  字元對象類別,
  特殊字元,
}
