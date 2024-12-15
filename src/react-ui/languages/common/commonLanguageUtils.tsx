import { unknownPronunciation } from '#/core'

import { T_LangUIController, T_LangOpts } from '../types'

import { saveSuccessChar, saveFailChar, saveSentenceStats } from './stats'

type 類型_解析發音 = (文字: string, langOpts?: T_LangOpts) => string

type T_OnPracticeBackspaceFormat = (practiceValue: string) => string

type T_CommonHandleWritingKeyDown = (
  opts: Parameters<T_LangUIController['handleKeyDown']>[0],
  opts2: {
    onPracticeBackspaceFormat?: T_OnPracticeBackspaceFormat
    解析發音?: 類型_解析發音
  },
) => ReturnType<T_LangUIController['handleKeyDown']>

const 預設解析發音: 類型_解析發音 = 文字 => 文字.toLowerCase()

const onPracticeBackspaceFormatDefault: T_OnPracticeBackspaceFormat = (
  p = '',
) => {
  return p
    .split(' ')
    .filter((ch, idx, arr) => idx !== arr.length - 1 || ch.trim() !== '')
    .filter((_, idx, arr) => idx !== arr.length - 1)
    .concat([''])
    .join(' ')
}

export const commonHandleWritingKeyDown: T_CommonHandleWritingKeyDown = (
  {
    charsObjsList,
    currentText,
    getCurrentCharObjFromPractice,
    langOpts,
    originalTextValue,
    practiceValue,
    selectedLanguage,
    setCurrentDisplayCharIdx,
    setCurrentText,
    setPractice,
    setPracticeHasError,
    setWriting,
    specialCharsValue = '',
    writingValue,
    按鍵事件,
  },
  {
    onPracticeBackspaceFormat = onPracticeBackspaceFormatDefault,
    解析發音 = 預設解析發音,
  },
) => {
  if (按鍵事件.key === 'Backspace' && writingValue.length === 0) {
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

  按鍵事件.preventDefault()

  const 解析按鍵 = (() => {
    // 按鍵音調更舒適
    switch (按鍵事件.key) {
      case '!':
        return '4'
      case '@':
        return '5'
      case '#':
        return '6'
      default:
        return 按鍵事件.key
    }
  })()

  if (!/[a-z0-9]/.test(解析按鍵)) {
    setPractice(practiceValue + 解析按鍵)

    return
  }

  if (解析按鍵.length !== 1 && 解析按鍵 !== 'Backspace') {
    return
  }

  const { pronunciation: correctPronunciation } = currentCharObj

  const newWritingValue =
    解析按鍵 === 'Backspace'
      ? writingValue.slice(0, writingValue.length - 1)
      : writingValue + 解析按鍵

  const correctPronunciationParsed = 解析發音(correctPronunciation, langOpts)
  const isDuringReduction = !!currentText

  if (
    correctPronunciationParsed === 解析發音(newWritingValue, langOpts) ||
    correctPronunciationParsed === unknownPronunciation
  ) {
    const newPractice = practiceValue + currentCharObj.word

    setWriting('')
    setPracticeHasError(false)
    setPractice(`${newPractice} `)

    if (!isDuringReduction) {
      saveSuccessChar(selectedLanguage, currentCharObj.word)
    }

    if (
      [undefined, '還原論者'].includes(
        langOpts.遊戲模式值 as string | undefined,
      )
    ) {
      const newPracticeText = (newPractice || '')
        .split('')
        .filter(c => !specialCharsValue.includes(c))
        .join('')

      const originalText = (originalTextValue || '')
        .split('')
        .filter(c => !specialCharsValue.includes(c))
        .join('')

      if (newPracticeText === originalText) {
        const charsWithMistakes = langOpts.charsWithMistakes as
          | string[]
          | undefined

        if (!isDuringReduction) {
          const uniqueMistakes = Array.from(new Set(charsWithMistakes ?? []))

          saveSentenceStats(
            selectedLanguage,
            charsObjsList.length,
            (charsObjsList.length - uniqueMistakes.length) /
              charsObjsList.length,
          )
        }

        if ((charsWithMistakes ?? []).length) {
          const fullChars = Array.from(new Set(charsWithMistakes))
            .join('')
            .repeat(3)

          setCurrentText(fullChars)
          langOpts.charsWithMistakes = []
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
    langOpts.charsWithMistakes = langOpts.charsWithMistakes || []

    if (
      !isDuringReduction &&
      !(langOpts.charsWithMistakes as string[])
        .slice(-1)
        .includes(currentCharObj.word)
    ) {
      saveFailChar(selectedLanguage, currentCharObj.word)
    }

    ;(langOpts.charsWithMistakes as string[]).push(currentCharObj.word)
  }

  setPracticeHasError(hasError)
}
