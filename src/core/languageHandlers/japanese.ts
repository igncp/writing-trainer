import { LanguageDefinition } from '../constants'
import { T_CharObj } from '../languageManager'

import { LanguageHandler } from './_common'

const MAX_CHARS_IN_WORD = 6

const convertToCharsObjs: LanguageHandler['convertToCharsObjs'] = ({
  charsToRemove,
  langOpts,
  text,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const defaultSpecialChars = japaneseHandler.getSpecialChars()

  const allCharsToRemove = new Set(
    defaultSpecialChars.concat(charsToRemove).concat([' ']),
  )

  const dictionary = langOpts?.dictionary as
    | Record<string, string | undefined>
    | undefined

  const pronunciationInput = ((langOpts?.pronunciationInput as string) || '')
    .split('\n')
    .reduce<Record<string, string>>((acc, item) => {
      const [char, pronunciationVal] = item.split(' ')

      acc[char] = pronunciationVal

      return acc
    }, {})

  if (!dictionary) {
    return []
  }

  const charsObjsList: T_CharObj[] = []

  let currentWord = ''

  const addWords = (textToAdd: string): number => {
    let charsAdded = 0

    for (let i = textToAdd.length; i > 0; i--) {
      const word = textToAdd.slice(0, i)
      const pronunciation = pronunciationInput[word] || dictionary[word]

      if (pronunciation) {
        charsObjsList.push(
          new T_CharObj({
            pronunciation,
            word,
          }),
        )

        charsAdded = i
        break
      }
    }

    if (!charsAdded) {
      charsObjsList.push(
        new T_CharObj({
          pronunciation: '',
          word: textToAdd[0],
        }),
      )

      charsAdded = 1
    }

    return charsAdded
  }

  text.split('').forEach((ch, idx) => {
    if (allCharsToRemove.has(ch)) {
      while (currentWord) {
        const charsAdded = addWords(currentWord)

        currentWord = currentWord.slice(charsAdded)
      }

      charsObjsList.push(
        new T_CharObj({
          pronunciation: '',
          word: ch,
        }),
      )

      currentWord = ''

      return
    }

    currentWord += ch

    if (currentWord.length >= MAX_CHARS_IN_WORD || idx === text.length - 1) {
      const charsAdded = addWords(currentWord)

      currentWord = currentWord.slice(charsAdded)

      if (idx === text.length - 1) {
        while (currentWord) {
          const charsAdded2 = addWords(currentWord)

          currentWord = currentWord.slice(charsAdded2)
        }
      }
    }
  })

  return charsObjsList
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
