import { T_CharsDisplayClickHandler } from '#/components/CharactersDisplay/CharactersDisplay'

import { getPronunciationOfTextFn } from '#/languages/common/commonLanguageUtils'
import { SPECIAL_CHARS } from '#/languages/common/specialCharacters'

import dictionary from './converted-list-jp.csv'

export { SPECIAL_CHARS }

export const charToPronunciationMap: { [key: string]: string } = {}
const pronunciationToCharMap: { [key: string]: string } = {}

dictionary.forEach(([char, pronunciation]: [string, string]) => {
  charToPronunciationMap[char] = pronunciation
  pronunciationToCharMap[pronunciation] = char
})

export const getPronunciationOfText = getPronunciationOfTextFn({
  SPECIAL_CHARS,
  charToPronunciationMap,
})

export const handleDisplayedCharClick: T_CharsDisplayClickHandler = () => {}
