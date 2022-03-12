import { LanguageDefinition } from '../constants'
import { CharObj, T_LanguageHandler } from '../languageManager'

import {
  defaultFilterTextToPractice,
  defaultGetSpecialChars,
  defaultGetCurrentCharObj,
} from './_common'

type T_Dictionary = { [k: string]: string }

const convertToCharsObjs: T_LanguageHandler['convertToCharsObjs'] = ({
  text,
  charsToRemove,
  langOpts = {},
}) => {
  const dictionary: T_Dictionary = (langOpts.dictionary || {}) as T_Dictionary
  const pronunciationInput: string = (langOpts.pronunciationInput ||
    '') as string
  const pronunciationInputArr = pronunciationInput.split(' ').filter(c => !!c)

  const defaultSpecialChars = defaultGetSpecialChars()
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])

  const charsObjs: CharObj[] = []

  text.split('').forEach((ch, chIdx) => {
    if (allCharsToRemove.includes(ch)) {
      const charObj = new CharObj({
        pronunciation: '',
        word: ch,
      })

      charsObjs.push(charObj)
    } else {
      const charObj = new CharObj({
        pronunciation: pronunciationInputArr[chIdx] || dictionary[ch] || '?',
        word: ch,
      })
      charsObjs.push(charObj)
    }
  })

  return charsObjs
}

const language = new LanguageDefinition({
  id: 'mandarin',
  name: 'Mandarin',
})

const mandarinHandler: T_LanguageHandler = {
  convertToCharsObjs,
  filterTextToPractice: defaultFilterTextToPractice,
  getCurrentCharObj: defaultGetCurrentCharObj,
  getSpecialChars: defaultGetSpecialChars,
  language,
}

export { mandarinHandler }
