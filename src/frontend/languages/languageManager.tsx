import { T_CharsDisplayClickHandler } from '#/components/CharactersDisplay/CharactersDisplay'

import {
  T_convertToCharsObjs,
  T_getFilteredTextToPracticeFn,
  T_getPronunciationOfText,
  T_getWritingKeyDownHandler,
  TLanguageDefinition,
  TLanguageId,
  TLinksBlock,
  TOptionsBlock,
} from './types'

import MandarinLinksBlock from './mandarin/LinksBlock/LinksBlock'
import * as mandarinUtils from './mandarin/mandarinUtils'
import MandarinOptionsBlock from './mandarin/OptionsBlock/OptionsBlock'

import * as japaneseUtils from './japanese/japaneseUtils'
import JapaneseLinksBlock from './japanese/LinksBlock/LinksBlock'
import JapaneseOptionsBlock from './japanese/OptionsBlock/OptionsBlock'

interface LanguageManager {
  getAvailableLanguages(): TLanguageDefinition[]
  getCharsObjsConverter(): T_convertToCharsObjs
  getDefaultLanguage(): TLanguageId
  getDisplayedCharHandler(id: TLanguageId): T_CharsDisplayClickHandler
  getFilteredTextToPracticeFn: T_getFilteredTextToPracticeFn
  getLinksBlock(id: TLanguageId): TLinksBlock
  getOptionsBlock(id: TLanguageId): TOptionsBlock
  getPronunciationOfText(
    id: TLanguageId,
    opts: Parameters<T_getPronunciationOfText>[0]
  ): ReturnType<T_getPronunciationOfText>
  getSpecialChars(id: TLanguageId): string
  getWritingKeyDownHandler: T_getWritingKeyDownHandler
}

const languageManager: LanguageManager = {
  getAvailableLanguages() {
    return [
      {
        id: 'mandarin',
        text: 'Mandarin',
      },
      {
        id: 'japanese',
        text: 'Japanese',
      },
    ]
  },
  getDefaultLanguage() {
    return 'mandarin'
  },
  getLinksBlock(languageId) {
    const languageMap: { [key: string]: TLinksBlock } = {
      japanese: JapaneseLinksBlock,
      mandarin: MandarinLinksBlock,
    }

    return (
      languageMap[languageId] ||
      languageMap[languageManager.getDefaultLanguage()]
    )
  },
  getSpecialChars(languageId) {
    const languageMap: { [key: string]: string } = {
      japanese: japaneseUtils.SPECIAL_CHARS,
      mandarin: mandarinUtils.SPECIAL_CHARS,
    }

    return (
      languageMap[languageId] ||
      languageMap[languageManager.getDefaultLanguage()]
    )
  },
  getDisplayedCharHandler(languageId) {
    const languageMap: { [key: string]: T_CharsDisplayClickHandler } = {
      japanese: japaneseUtils.handleDisplayedCharClick,
      mandarin: mandarinUtils.handleDisplayedCharClick,
    }

    return (
      languageMap[languageId] ||
      languageMap[languageManager.getDefaultLanguage()]
    )
  },
  getCharsObjsConverter() {
    return mandarinUtils.convertToCharsObjs
  },
  getPronunciationOfText(languageId, opts) {
    const languageMap: { [key: string]: T_getPronunciationOfText } = {
      japanese: japaneseUtils.getPronunciationOfText,
      mandarin: mandarinUtils.getPronunciationOfText,
    }
    const fn =
      languageMap[languageId] ||
      languageMap[languageManager.getDefaultLanguage()]

    return fn(opts)
  },
  getFilteredTextToPracticeFn: mandarinUtils.getFilteredTextToPracticeFn,
  getOptionsBlock(languageId) {
    const languageMap: { [key: string]: TOptionsBlock } = {
      japanese: JapaneseOptionsBlock,
      mandarin: MandarinOptionsBlock,
    }

    return (
      languageMap[languageId] ||
      languageMap[languageManager.getDefaultLanguage()]
    )
  },
  getWritingKeyDownHandler: mandarinUtils.getWritingKeyDownHandler,
}

export default languageManager
