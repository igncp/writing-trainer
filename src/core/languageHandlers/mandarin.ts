import { LanguageDefinition, unknownPronunciation } from '../constants'
import { T_CharObj } from '../languageManager'

import { LanguageHandler } from './_common'

type T_Dictionary = { [k: string]: string }

const 轉換為字元對象列表: LanguageHandler['轉換為字元對象列表'] = ({
  charsToRemove,
  langOpts = {},
  text,
}) => {
  const dictionary: T_Dictionary = (langOpts.dictionary || {}) as T_Dictionary
  const pronunciationInput: string = (langOpts.pronunciationInput ||
    '') as string
  const pronunciationInputArr = pronunciationInput.split(' ').filter(c => !!c)

  const defaultSpecialChars = mandarinHandler.getSpecialChars() // eslint-disable-line @typescript-eslint/no-use-before-define
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])

  const charsObjsList: T_CharObj[] = []

  text.split('').forEach((ch, chIdx) => {
    if (allCharsToRemove.includes(ch)) {
      const charObj = new T_CharObj({
        pronunciation: '',
        word: ch,
      })

      charsObjsList.push(charObj)
    } else {
      const charObj = new T_CharObj({
        pronunciation:
          pronunciationInputArr[chIdx] ||
          dictionary[ch] ||
          unknownPronunciation,
        word: ch,
      })
      charsObjsList.push(charObj)
    }
  })

  return charsObjsList
}

const language = new LanguageDefinition({
  id: 'mandarin',
  name: 'Mandarin',
})

const mandarinHandler = new LanguageHandler({
  extraSpecialChars:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''),
  language,
  轉換為字元對象列表,
})

export { mandarinHandler }
