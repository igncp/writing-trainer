import { T_UIHandler, T_LangOpts } from '../types'

type T_ParsePronunciation = (text: string, langOpts?: T_LangOpts) => string
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
    languageOptions,
    practiceValue,
    setCurrentDisplayCharIdx,
    setPractice,
    setPracticeHasError,
    setWriting,
    writingValue,
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

  // including capital letters so it doesn't write when shortcut
  if (!/[a-z0-9A-Z]/.test(keyEvent.key)) {
    keyEvent.preventDefault()

    setPractice(practiceValue + keyEvent.key)

    return
  }

  if (keyEvent.key.length !== 1 && keyEvent.key !== 'Backspace') {
    keyEvent.preventDefault()

    return
  }

  keyEvent.preventDefault()

  const { pronunciation: correctPronunciation } = currentCharObj

  const newWritingValue =
    keyEvent.key === 'Backspace'
      ? writingValue.slice(0, writingValue.length - 1)
      : writingValue + keyEvent.key

  if (
    parsePronunciation(correctPronunciation, languageOptions) ===
    parsePronunciation(newWritingValue, languageOptions)
  ) {
    setWriting('')
    setPracticeHasError(false)
    setPractice(`${practiceValue + currentCharObj.word} `)

    return
  }

  setWriting(newWritingValue)

  setPracticeHasError(!correctPronunciation.startsWith(newWritingValue))
}
