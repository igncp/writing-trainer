import { LanguageDefinition } from '../constants'
import { CharObj } from '../languageManager'

import { LanguageHandler } from './_common'

const convertToCharsObjs: LanguageHandler['convertToCharsObjs'] = ({
  text,
  charsToRemove,
}) => {
  const specialChars = englishHandler.getSpecialChars() // eslint-disable-line @typescript-eslint/no-use-before-define
  const allCharsToRemove = specialChars.concat(charsToRemove).concat([' '])

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

const englishHandler = new LanguageHandler({
  convertToCharsObjs,
  language,
})

export { englishHandler }
