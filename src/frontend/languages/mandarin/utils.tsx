export const convertToCharsObjs = ({ pronunciation, text, charsToRemove }) => {
  const pronunciationArr = pronunciation.split(' ').filter(c => !!c)
  const textSegments = text
    .split('')
    .filter(c => !!c)
    .filter(c => charsToRemove.indexOf(c) === -1)

  if (pronunciationArr.length !== textSegments.length) {
    return []
  }

  return textSegments.map((segment, idx) => {
    return {
      pronunciation: pronunciationArr[idx],
      word: segment,
    }
  })
}
