import { T_filterTextToPractice } from '../languageManager'

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
    .filter(c => !!c)
    .filter(c => allCharsToRemove.indexOf(c) === -1)
    .join('')
}

export { defaultFilterTextToPractice, defaultGetSpecialChars }
