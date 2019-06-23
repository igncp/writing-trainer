import { T_CharObj } from '#/languages/types'

export type T_getCurrentCharObj = (opts: {
  originalCharsObjs: T_CharObj[]
  practiceCharsObjs: T_CharObj[]
}) => T_CharObj | null

export const getCurrentCharObj: T_getCurrentCharObj = ({
  originalCharsObjs,
  practiceCharsObjs,
}) => {
  const hasPronunciation = (c: T_CharObj) => !!c.pronunciation
  const originalCharsWithPronunciation = originalCharsObjs.filter(
    hasPronunciation
  )
  const practiceCharsWithPronunciation = practiceCharsObjs.filter(
    hasPronunciation
  )

  for (
    let practiceIndex = 0;
    practiceIndex < practiceCharsWithPronunciation.length;
    practiceIndex += 1
  ) {
    const expectedChar =
      originalCharsWithPronunciation[
        practiceIndex % originalCharsWithPronunciation.length
      ]

    if (
      expectedChar.word !== practiceCharsWithPronunciation[practiceIndex].word
    ) {
      return expectedChar
    }
  }

  return originalCharsWithPronunciation[
    practiceCharsWithPronunciation.length %
      originalCharsWithPronunciation.length
  ]
}
