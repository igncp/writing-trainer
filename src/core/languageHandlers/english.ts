import { LanguageDefinition } from '../constants'
import { 字元對象類別 } from '../languageManager'

import { LanguageHandler } from './_common'

const 轉換為字元對象列表: LanguageHandler['轉換為字元對象列表'] = ({
  charsToRemove,
  text,
}) => {
  const specialChars = englishHandler.取得特殊字符() // eslint-disable-line @typescript-eslint/no-use-before-define
  const allCharsToRemove = specialChars.concat(charsToRemove).concat([' '])

  const 字元對象列表: 字元對象類別[] = []
  let nextWord = ''

  const addWord = () => {
    if (nextWord) {
      const 字元對象 = new 字元對象類別({
        pronunciation: nextWord,
        word: nextWord,
      })
      字元對象列表.push(字元對象)

      nextWord = ''
    }
  }

  text.split('').forEach(ch => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      const 字元對象 = new 字元對象類別({
        pronunciation: '',
        word: ch,
      })

      字元對象列表.push(字元對象)
    } else {
      nextWord += ch
    }
  })

  addWord()

  return 字元對象列表
}

const language = new LanguageDefinition({
  id: 'english',
  name: 'English',
})

const englishHandler = new LanguageHandler({
  language,
  轉換為字元對象列表,
})

export { englishHandler }
