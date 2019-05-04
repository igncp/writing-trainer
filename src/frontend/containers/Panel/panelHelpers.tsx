const getIsParsedPracticeTextValid = ({ practiceText, origText }): boolean => {
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

type T_getCurrentPracticeWord = (opts: {
  origText: string
  practiceText: string
  specialChars: string
  extractFn(string): (string) => string
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
