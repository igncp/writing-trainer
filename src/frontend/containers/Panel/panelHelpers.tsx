type T_getIsParsedPracticeTextValid = (opts: {
  practiceText: string
  origText: string
}) => boolean

const getIsParsedPracticeTextValid: T_getIsParsedPracticeTextValid = ({
  practiceText,
  origText,
}) => {
  return practiceText.split('').reduce((acc, ch, idx) => {
    if (!acc) {
      return acc
    }

    if (ch !== origText[idx % origText.length]) {
      return false
    }

    return acc
  }, true)
}

export type T_getCurrentPracticeWord = (opts: {
  origText: string
  practiceText: string
  specialChars: string
  extractFn(s: string): (s: string) => string
}) => string | null

export const getCurrentPracticeWord: T_getCurrentPracticeWord = ({
  origText,
  practiceText,
  specialChars,
  extractFn,
}) => {
  const getChineseCharsOnlyText = extractFn(specialChars)
  const usedOrigText = getChineseCharsOnlyText(origText)
  const usedPracticeText = getChineseCharsOnlyText(practiceText)

  const isValid = getIsParsedPracticeTextValid({
    origText: usedOrigText,
    practiceText: usedPracticeText,
  })

  if (!isValid) {
    return null
  }

  return usedOrigText[usedPracticeText.length % usedOrigText.length]
}
