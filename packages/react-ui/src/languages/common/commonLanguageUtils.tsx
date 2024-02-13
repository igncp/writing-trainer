import { unknownPronunciation } from 'writing-trainer-core'

import { T_UIHandler, 類型_語言選項 } from '../types'

import { 儲存成功字元, 儲存失敗字元 } from './統計'

type T_ParsePronunciation = (text: string, 語言選項?: 類型_語言選項) => string
type T_OnPracticeBackspaceFormat = (practiceValue: string) => string

type T_CommonHandleWritingKeyDown = (
  opts: Parameters<T_UIHandler['handleWritingKeyDown']>[0],
  opts2: {
    onPracticeBackspaceFormat?: T_OnPracticeBackspaceFormat
    parsePronunciation?: T_ParsePronunciation
  },
) => ReturnType<T_UIHandler['handleWritingKeyDown']>

const parsePronunciationDefault: T_ParsePronunciation = p => p.toLowerCase()

const onPracticeBackspaceFormatDefault: T_OnPracticeBackspaceFormat = p => {
  return p
    .split(' ')
    .filter((ch, idx, arr) => idx !== arr.length - 1 || ch.trim() !== '')
    .filter((_, idx, arr) => idx !== arr.length - 1)
    .concat([''])
    .join(' ')
}

export const commonHandleWritingKeyDown: T_CommonHandleWritingKeyDown = (
  {
    getCurrentCharObjFromPractice,
    keyEvent,
    originalTextValue,
    practiceValue,
    setCurrentDisplayCharIdx,
    setCurrentText,
    setPractice,
    setPracticeHasError,
    setWriting,
    specialCharsValue,
    writingValue,
    語言選項,
  },
  {
    onPracticeBackspaceFormat = onPracticeBackspaceFormatDefault,
    parsePronunciation = parsePronunciationDefault,
  },
) => {
  if (keyEvent.key === 'Backspace' && writingValue.length === 0) {
    const newPracticeText = onPracticeBackspaceFormat(practiceValue)

    setPractice(newPracticeText)
    const langObj = getCurrentCharObjFromPractice(newPracticeText)

    if (langObj?.ch) {
      setCurrentDisplayCharIdx(langObj.index)
    }

    return
  }

  const currentLangObj = getCurrentCharObjFromPractice()

  if (!currentLangObj?.ch) {
    setPracticeHasError(false)

    return
  }

  setCurrentDisplayCharIdx(currentLangObj.index)

  const { ch: currentCharObj } = currentLangObj

  keyEvent.preventDefault()

  // including capital letters so it doesn't write when shortcut
  if (!/[a-z0-9A-Z]/.test(keyEvent.key)) {
    setPractice(practiceValue + keyEvent.key)

    return
  }

  if (keyEvent.key.length !== 1 && keyEvent.key !== 'Backspace') {
    return
  }

  const { pronunciation: correctPronunciation } = currentCharObj

  const newWritingValue =
    keyEvent.key === 'Backspace'
      ? writingValue.slice(0, writingValue.length - 1)
      : writingValue + keyEvent.key

  const correctPronunciationParsed = parsePronunciation(
    correctPronunciation,
    語言選項,
  )

  if (
    correctPronunciationParsed ===
      parsePronunciation(newWritingValue, 語言選項) ||
    correctPronunciationParsed === unknownPronunciation
  ) {
    const newPractice = practiceValue + currentCharObj.word

    setWriting('')
    setPracticeHasError(false)
    setPractice(`${newPractice} `)

    if (process.env.NODE_ENV !== 'test') {
      儲存成功字元(currentCharObj.word)
    }

    if (語言選項.遊戲模式值 === '還原論者') {
      const newPracticeText = newPractice
        .split('')
        .filter(c => !specialCharsValue.includes(c))
        .join('')

      const originalText = originalTextValue
        .split('')
        .filter(c => !specialCharsValue.includes(c))
        .join('')

      if (newPracticeText === originalText) {
        const wrongCharacters = 語言選項.wrongCharacters as string[] | undefined

        if ((wrongCharacters ?? []).length) {
          const chars = Array.from(new Set(wrongCharacters))
          const fullChars = Array.from({ length: 3 })
            .map(() => {
              return chars.join('')
            })
            .join('')

          setCurrentText(fullChars)
          語言選項.wrongCharacters = []
        } else {
          setCurrentText('')
        }

        setPractice('')
      }
    }

    return
  }

  setWriting(newWritingValue)

  const hasError = !correctPronunciation.startsWith(newWritingValue)

  if (hasError) {
    語言選項.wrongCharacters = 語言選項.wrongCharacters || []

    if (
      !(語言選項.wrongCharacters as string[])
        .slice(0)
        .slice(-1)
        .includes(currentCharObj.word) &&
      process.env.NODE_ENV !== 'test'
    ) {
      儲存失敗字元(currentCharObj.word)
    }
    ;(語言選項.wrongCharacters as string[]).push(currentCharObj.word)
  }

  setPracticeHasError(hasError)
}
