import {
  T_CharObj,
  T_LanguageHandler,
  T_convertToCharsObjs,
} from '../languageManager'

import { defaultFilterTextToPractice, defaultGetSpecialChars } from './_common'

const convertToCharsObjs: T_convertToCharsObjs = ({
  text,
  charsToRemove,
  langOpts = {},
}) => {
  const defaultSpecialChars = defaultGetSpecialChars()
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])
  const pronunciationInput: string = (langOpts.pronunciationInput ||
    '') as string
  const pronunciationInputArr = pronunciationInput
    .split(' ')
    .filter(c => !!c)
    .map(segment => {
      const numRegResul = /([a-z]+)([0-9]+)/.exec(segment)

      if (!numRegResul || !numRegResul[1] || !numRegResul[2]) {
        return { num: 1, text: segment }
      }

      return { num: Number(numRegResul[2]), text: numRegResul[1] }
    })

  const charsObjs: T_CharObj[] = []
  let nextWord = ''

  const addWord = () => {
    if (!nextWord) {
      return
    }

    charsObjs.push({
      pronunciation: pronunciationInputArr.length
        ? pronunciationInputArr.shift().text
        : '?',
      word: nextWord,
    })

    nextWord = ''
  }

  text.split('').forEach(ch => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      charsObjs.push({
        pronunciation: '',
        word: ch,
      })

      return
    }

    if (
      pronunciationInputArr.length &&
      nextWord.length === pronunciationInputArr[0].num
    ) {
      addWord()
    }

    nextWord += ch
  })

  addWord()

  return charsObjs
}

const englishHandler: T_LanguageHandler = {
  convertToCharsObjs,
  filterTextToPractice: defaultFilterTextToPractice,
  getSpecialChars: defaultGetSpecialChars,
  id: 'japanese',
  name: 'Japanese',
}

export default englishHandler
