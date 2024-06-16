import { LanguageDefinition } from '../constants'
import { T_CharObj } from '../languageManager'

import { LanguageHandler } from './_common'

const 轉換為字元對象列表: LanguageHandler['轉換為字元對象列表'] = ({
  charsToRemove,
  langOpts = {},
  text,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const defaultSpecialChars = japaneseHandler.取得特殊字符()
  const allCharsToRemove = defaultSpecialChars
    .concat(charsToRemove)
    .concat([' '])
  const pronunciationInput: string = (langOpts.pronunciationInput ||
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

  const charsObjsList: T_CharObj[] = []
  let nextWord = ''

  const addWord = () => {
    if (!nextWord) {
      return
    }

    const charObj = new T_CharObj({
      pronunciation: pronunciationInputArr.length
        ? pronunciationInputArr.shift()!.text
        : '?',
      word: nextWord,
    })
    charsObjsList.push(charObj)

    nextWord = ''
  }

  text.split('').forEach(ch => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      const charObj = new T_CharObj({
        pronunciation: '',
        word: ch,
      })
      charsObjsList.push(charObj)

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

  return charsObjsList
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
