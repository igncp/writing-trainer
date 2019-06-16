import { T_getPronunciationOfText } from '#/languages/types'

type T_getPronunciationOfTextFn = (o: {
  charToPronunciationMap: { [key: string]: string }
  SPECIAL_CHARS: string
}) => T_getPronunciationOfText

export const getPronunciationOfTextFn: T_getPronunciationOfTextFn = ({
  charToPronunciationMap,
  SPECIAL_CHARS,
}) => ({ text, charsToRemove }) => {
  const allCharsToRemove = charsToRemove.concat(SPECIAL_CHARS)
  const textSegments = text
    .split('')
    .filter(c => !!c)
    .filter(c => allCharsToRemove.indexOf(c) === -1)
  const pronunciationArr = textSegments
    .map(t => {
      return charToPronunciationMap[t]
    })
    .filter(c => !!c)

  if (pronunciationArr.length !== textSegments.length) {
    return ''
  }

  return pronunciationArr.join(' ')
}
