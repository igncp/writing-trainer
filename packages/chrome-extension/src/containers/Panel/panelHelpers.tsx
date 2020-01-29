import { T_getCurrentCharObj } from '#/languages/types'

export const getCurrentCharObj: T_getCurrentCharObj = ({
  originalCharsObjs,
  practiceCharsObjs,
}) => {
  const originalCharsWithPronunciationObjs = originalCharsObjs
    .map((ch, idx) => ({ ch, idx }))
    .filter(c => !!c.ch.pronunciation)
  const practiceCharsWithPronunciation = practiceCharsObjs.filter(
    c => !!c.pronunciation
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

  return {
    ch: originalCharsWithPronunciationObjs[originalCharIdx].ch,
    index: originalCharsWithPronunciationObjs[originalCharIdx].idx,
  }
}
