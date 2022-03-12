import { CurrentCharObj, T_LanguageHandler } from '../languageManager'

import { SPECIAL_SYMBOLS } from './_commonChars'

const defaultGetSpecialChars = () => {
  return SPECIAL_SYMBOLS
}

const defaultFilterTextToPractice: T_LanguageHandler['filterTextToPractice'] =
  ({ text, charsToRemove }) => {
    const defaultSpecialChars = defaultGetSpecialChars()
    const allCharsToRemove = charsToRemove.concat(defaultSpecialChars)

    return text
      .split('')
      .filter(c => !!c)
      .filter(c => !allCharsToRemove.includes(c))
      .join('')
  }

const defaultGetCurrentCharObj: T_LanguageHandler['getCurrentCharObj'] = ({
  originalCharsObjs,
  practiceCharsObjs,
}) => {
  const originalCharsWithPronunciationObjs = originalCharsObjs
    .map((ch, idx) => ({ ch, idx }))
    .filter(c => !!c.ch.pronunciation)
  const practiceCharsWithPronunciation = practiceCharsObjs.filter(
    c => !!c.pronunciation,
  )

  let originalCharIdx = 0

  for (
    let practiceIndex = 0;
    practiceIndex < practiceCharsWithPronunciation.length;
    practiceIndex += 1
  ) {
    originalCharIdx = practiceIndex % originalCharsWithPronunciationObjs.length

    const expectedCharObj = originalCharsWithPronunciationObjs[originalCharIdx]

    if (
      expectedCharObj.ch.word !==
      practiceCharsWithPronunciation[practiceIndex].word
    ) {
      return new CurrentCharObj({
        ch: expectedCharObj.ch,
        index: expectedCharObj.idx,
      })
    }
  }

  originalCharIdx =
    practiceCharsWithPronunciation.length %
    originalCharsWithPronunciationObjs.length

  if (!originalCharsWithPronunciationObjs.length) {
    return null
  }

  return new CurrentCharObj({
    ch: originalCharsWithPronunciationObjs[originalCharIdx].ch,
    index: originalCharsWithPronunciationObjs[originalCharIdx].idx,
  })
}

export {
  defaultFilterTextToPractice,
  defaultGetSpecialChars,
  defaultGetCurrentCharObj,
}
