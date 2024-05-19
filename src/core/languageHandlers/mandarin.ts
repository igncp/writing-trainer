import { LanguageDefinition, unknownPronunciation } from '../constants'
import { 字元對象類別 } from '../languageManager'

import { LanguageHandler } from './_common'

type T_Dictionary = { [k: string]: string }

const 轉換為字元對象列表: LanguageHandler['轉換為字元對象列表'] = ({
  charsToRemove,
  text,
  語言選項 = {},
}) => {
  const dictionary: T_Dictionary = (語言選項.dictionary || {}) as T_Dictionary
  const pronunciationInput: string = (語言選項.pronunciationInput ||
    '') as string
  const pronunciationInputArr = pronunciationInput.split(' ').filter(c => !!c)

  const defaultSpecialChars = mandarinHandler.取得特殊字符() // eslint-disable-line @typescript-eslint/no-use-before-define
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])

  const 字元對象列表: 字元對象類別[] = []

  text.split('').forEach((ch, chIdx) => {
    if (allCharsToRemove.includes(ch)) {
      const 字元對象 = new 字元對象類別({
        pronunciation: '',
        word: ch,
      })

      字元對象列表.push(字元對象)
    } else {
      const 字元對象 = new 字元對象類別({
        pronunciation:
          pronunciationInputArr[chIdx] ||
          dictionary[ch] ||
          unknownPronunciation,
        word: ch,
      })
      字元對象列表.push(字元對象)
    }
  })

  return 字元對象列表
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
