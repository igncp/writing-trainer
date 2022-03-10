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

type T_Dictionary = { [k: string]: string }

const convertToCharsObjs: T_convertToCharsObjs = ({
  text,
  charsToRemove,
  langOpts = {},
}) => {
  const dictionary: T_Dictionary = (langOpts.dictionary || {}) as T_Dictionary
  const pronunciationInput: string = (langOpts.pronunciationInput ||
    '') as string
  const pronunciationInputArr = pronunciationInput.split(' ').filter((c) => !!c)

  const defaultSpecialChars = defaultGetSpecialChars()
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])

  const charsObjs: T_CharObj[] = []

  text.split('').forEach((ch, chIdx) => {
    if (allCharsToRemove.includes(ch)) {
      charsObjs.push({
        pronunciation: '',
        word: ch,
      })
    } else {
      charsObjs.push({
        pronunciation: pronunciationInputArr[chIdx] || dictionary[ch] || '?',
        word: ch,
      })
    }
  })

  return charsObjs
}

const mandarinHandler: T_LanguageHandler = {
  convertToCharsObjs,
  filterTextToPractice: defaultFilterTextToPractice,
  getCurrentCharObj: defaultGetCurrentCharObj,
  getSpecialChars: defaultGetSpecialChars,
  id: 'mandarin',
  name: 'Mandarin',
}

export default mandarinHandler
