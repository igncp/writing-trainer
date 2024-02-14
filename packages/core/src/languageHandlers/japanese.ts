import { LanguageDefinition } from '../constants'
import { 字元對象類別 } from '../languageManager'

import { LanguageHandler } from './_common'

const 轉換為字元對象列表: LanguageHandler['轉換為字元對象列表'] = ({
  charsToRemove,
  text,
  語言選項 = {},
}) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const defaultSpecialChars = japaneseHandler.取得特殊字符()
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])
  const pronunciationInput: string = (語言選項.pronunciationInput ||
    '') as string
  const pronunciationInputArr = pronunciationInput
    .replace(/ō/g, 'ou')
    .toLowerCase()
    .split(' ')
    .filter(c => !!c)
    .map(segment => {
      const numRegResul = /([a-z]+)([0-9]+)/.exec(segment)

      if (!numRegResul?.[1] || !numRegResul[2]) {
        return { num: 1, text: segment }
      }

      return { num: Number(numRegResul[2]), text: numRegResul[1] }
    })

  const 字元對象列表: 字元對象類別[] = []
  let nextWord = ''

  const addWord = () => {
    if (!nextWord) {
      return
    }

    const 字元對象 = new 字元對象類別({
      pronunciation: pronunciationInputArr.length
        ? pronunciationInputArr.shift()!.text
        : '?',
      word: nextWord,
    })
    字元對象列表.push(字元對象)

    nextWord = ''
  }

  text.split('').forEach(ch => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      const 字元對象 = new 字元對象類別({
        pronunciation: '',
        word: ch,
      })
      字元對象列表.push(字元對象)

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

  return 字元對象列表
}

const language = new LanguageDefinition({
  id: 'japanese',
  name: 'Japanese',
})

const japaneseHandler = new LanguageHandler({
  language,
  轉換為字元對象列表,
})

export { japaneseHandler }
