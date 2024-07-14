import { LanguageDefinition } from '../constants'
import { T_CharObj } from '../languageManager'

import { LanguageHandler } from './_common'

const convertToCharsObjs: LanguageHandler['convertToCharsObjs'] = ({
  charsToRemove,
  text,
}) => {
  const specialChars = englishHandler.getSpecialChars() // eslint-disable-line @typescript-eslint/no-use-before-define
  const allCharsToRemove = specialChars.concat(charsToRemove).concat([' '])

  const charsObjsList: T_CharObj[] = []

  let nextWord = ''

  const addWord = () => {
    if (nextWord) {
      const charObj = new T_CharObj({
        pronunciation: nextWord,
        word: nextWord,
      })

      charsObjsList.push(charObj)

      nextWord = ''
    }
  }

  text.split('').forEach(ch => {
    if (allCharsToRemove.includes(ch)) {
      addWord()

      const charObj = new T_CharObj({
        pronunciation: '',
        word: ch,
      })

      charsObjsList.push(charObj)
    } else {
      nextWord += ch
    }
  })

  addWord()

  return charsObjsList
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
