import {
  T_CharObj,
  T_LanguageHandler,
  T_convertToCharsObjs,
} from '../languageManager'

import {
  defaultFilterTextToPractice,
  defaultGetSpecialChars,
  defaultGetCurrentCharObj,
} from './_common'

const convertToCharsObjs: T_convertToCharsObjs = ({ text, charsToRemove }) => {
  const defaultSpecialChars = defaultGetSpecialChars()
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])

  const charsObjs: T_CharObj[] = []
  let nextWord = ''

  const addWord = () => {
    if (nextWord) {
      charsObjs.push({
        pronunciation: nextWord,
        word: nextWord,
      })

      nextWord = ''
    }
  }

  text.split('').forEach((ch) => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      charsObjs.push({
        pronunciation: '',
        word: ch,
      })
    } else {
      nextWord += ch
    }
  })

  addWord()

  return charsObjs
}

const englishHandler: T_LanguageHandler = {
  convertToCharsObjs,
  filterTextToPractice: defaultFilterTextToPractice,
  getCurrentCharObj: defaultGetCurrentCharObj,
  getSpecialChars: defaultGetSpecialChars,
  id: 'english',
  name: 'English',
}

export default englishHandler
