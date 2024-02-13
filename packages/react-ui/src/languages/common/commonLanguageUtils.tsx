import { unknownPronunciation } from 'writing-trainer-core'

import { T_UIHandler, 類型_語言選項 } from '../types'

import { 儲存成功字元, 儲存失敗字元 } from './統計'

type 類型_解析發音 = (文字: string, 語言選項?: 類型_語言選項) => string
type T_OnPracticeBackspaceFormat = (practiceValue: string) => string

type T_CommonHandleWritingKeyDown = (
  opts: Parameters<T_UIHandler['handleWritingKeyDown']>[0],
  opts2: {
    onPracticeBackspaceFormat?: T_OnPracticeBackspaceFormat
    解析發音?: 類型_解析發音
  },
) => ReturnType<T_UIHandler['handleWritingKeyDown']>

const 預設解析發音: 類型_解析發音 = 文字 => 文字.toLowerCase()

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
    originalTextValue,
    practiceValue,
    setCurrentDisplayCharIdx,
    setCurrentText,
    setPractice,
    setPracticeHasError,
    setWriting,
    specialCharsValue,
    writingValue,
    按鍵事件,
    語言選項,
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

  // including capital letters so it doesn't write when shortcut
  if (!/[a-z0-9A-Z]/.test(按鍵事件.key)) {
    setPractice(practiceValue + 按鍵事件.key)

    return
  }

  if (按鍵事件.key.length !== 1 && 按鍵事件.key !== 'Backspace') {
    return
  }

  const { pronunciation: correctPronunciation } = currentCharObj

  const newWritingValue =
    按鍵事件.key === 'Backspace'
      ? writingValue.slice(0, writingValue.length - 1)
      : writingValue + 按鍵事件.key

  const correctPronunciationParsed = 解析發音(correctPronunciation, 語言選項)

  if (
    correctPronunciationParsed === 解析發音(newWritingValue, 語言選項) ||
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
        const 錯誤的字符 = 語言選項.錯誤的字符 as string[] | undefined

        if ((錯誤的字符 ?? []).length) {
          const chars = Array.from(new Set(錯誤的字符))
          const fullChars = Array.from({ length: 3 })
            .map(() => {
              return chars.join('')
            })
            .join('')

          setCurrentText(fullChars)
          語言選項.錯誤的字符 = []
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
    語言選項.錯誤的字符 = 語言選項.錯誤的字符 || []

    if (
      !(語言選項.錯誤的字符 as string[])
        .slice(0)
        .slice(-1)
        .includes(currentCharObj.word) &&
      process.env.NODE_ENV !== 'test'
    ) {
      儲存失敗字元(currentCharObj.word)
    }
    ;(語言選項.錯誤的字符 as string[]).push(currentCharObj.word)
  }

  setPracticeHasError(hasError)
}
