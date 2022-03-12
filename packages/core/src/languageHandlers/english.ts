import { LanguageDefinition } from '../constants'
import { CharObj, T_LanguageHandler } from '../languageManager'

import {
  defaultFilterTextToPractice,
  defaultGetSpecialChars,
  defaultGetCurrentCharObj,
} from './_common'

const convertToCharsObjs: T_LanguageHandler['convertToCharsObjs'] = ({
  text,
  charsToRemove,
}) => {
  const defaultSpecialChars = defaultGetSpecialChars()
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])

  const charsObjs: CharObj[] = []
  let nextWord = ''

  const addWord = () => {
    if (nextWord) {
      const charObj = new CharObj({
        pronunciation: nextWord,
        word: nextWord,
      })
      charsObjs.push(charObj)

      nextWord = ''
    }
  }

  text.split('').forEach(ch => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      const charObj = new CharObj({
        pronunciation: '',
        word: ch,
      })

      charsObjs.push(charObj)
    } else {
      nextWord += ch
    }
  })

  addWord()

  return charsObjs
}

const language = new LanguageDefinition({
  id: 'english',
  name: 'English',
})

const englishHandler: T_LanguageHandler = {
  convertToCharsObjs,
  filterTextToPractice: defaultFilterTextToPractice,
  getCurrentCharObj: defaultGetCurrentCharObj,
  getSpecialChars: defaultGetSpecialChars,
  language,
}

export { englishHandler }
