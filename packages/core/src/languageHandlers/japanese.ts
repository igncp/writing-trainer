import { LanguageDefinition } from '../constants'
import { CharObj } from '../languageManager'

import { LanguageHandler } from './_common'

const convertToCharsObjs: LanguageHandler['convertToCharsObjs'] = ({
  text,
  charsToRemove,
  langOpts = {},
}) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const defaultSpecialChars = japaneseHandler.getSpecialChars()
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

  const charsObjs: CharObj[] = []
  let nextWord = ''

  const addWord = () => {
    if (!nextWord) {
      return
    }

    const charObj = new CharObj({
      pronunciation: pronunciationInputArr.length
        ? pronunciationInputArr.shift()!.text
        : '?',
      word: nextWord,
    })
    charsObjs.push(charObj)

    nextWord = ''
  }

  text.split('').forEach(ch => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      const charObj = new CharObj({
        pronunciation: '',
        word: ch,
      })
      charsObjs.push(charObj)

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

const language = new LanguageDefinition({
  id: 'japanese',
  name: 'Japanese',
})

const japaneseHandler = new LanguageHandler({
  convertToCharsObjs,
  language,
})

export { japaneseHandler }
