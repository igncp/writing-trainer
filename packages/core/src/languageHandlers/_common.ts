import { T_filterTextToPractice, T_getCurrentCharObj } from '../languageManager'

import { SPECIAL_SYMBOLS } from './_commonChars'

const defaultGetSpecialChars = () => {
  return SPECIAL_SYMBOLS
}

const defaultFilterTextToPractice: T_filterTextToPractice = ({
  text,
  charsToRemove,
}) => {
  const defaultSpecialChars = defaultGetSpecialChars()
  const allCharsToRemove = charsToRemove.concat(defaultSpecialChars)

  return text
    .split('')
    .filter((c) => !!c)
    .filter((c) => allCharsToRemove.indexOf(c) === -1)
    .join('')
}

const defaultGetCurrentCharObj: T_getCurrentCharObj = ({
  originalCharsObjs,
  practiceCharsObjs,
}) => {
  const originalCharsWithPronunciationObjs = originalCharsObjs
    .map((ch, idx) => ({ ch, idx }))
    .filter((c) => !!c.ch.pronunciation)
  const practiceCharsWithPronunciation = practiceCharsObjs.filter(
    (c) => !!c.pronunciation
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
      return { ch: expectedCharObj.ch, index: expectedCharObj.idx }
    }
  }

  originalCharIdx =
    practiceCharsWithPronunciation.length %
    originalCharsWithPronunciationObjs.length

  if (!originalCharsWithPronunciationObjs.length) {
    return null
  }

  return {
    ch: originalCharsWithPronunciationObjs[originalCharIdx].ch,
    index: originalCharsWithPronunciationObjs[originalCharIdx].idx,
  }
}

export {
  defaultFilterTextToPractice,
  defaultGetSpecialChars,
  defaultGetCurrentCharObj,
}
