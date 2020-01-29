import {
  T_getPronunciationOfText,
  T_UIHandler,
  T_LangOpts,
} from '#/languages/types'

type T_getPronunciationOfTextFn = (o: {
  charToPronunciationMap: { [key: string]: string }
  SPECIAL_CHARS: string
}) => T_getPronunciationOfText

export const getPronunciationOfTextFn: T_getPronunciationOfTextFn = ({
  charToPronunciationMap,
  SPECIAL_CHARS,
}) => ({ text, charsToRemove }) => {
  const allCharsToRemove = charsToRemove.concat(SPECIAL_CHARS)
  const textSegments = text
    .split('')
    .filter(c => !!c)
    .filter(c => allCharsToRemove.indexOf(c) === -1)
  const pronunciationArr = textSegments
    .map(t => {
      return charToPronunciationMap[t]
    })
    .filter(c => !!c)

  if (pronunciationArr.length !== textSegments.length) {
    return ''
  }

  return pronunciationArr.join(' ')
}

type T_ParsePronunciation = (text: string, langOpts?: T_LangOpts) => string
type T_OnPracticeBackspaceFormat = (practiceValue: string) => string

type T_CommonHandleWritingKeyDown = (
  opts: Parameters<T_UIHandler['handleWritingKeyDown']>[0],
  opts2: {
    onPracticeBackspaceFormat?: T_OnPracticeBackspaceFormat
    parsePronunciation?: T_ParsePronunciation
  }
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
  }
) => {
  if (keyEvent.key === 'Backspace' && writingValue.length === 0) {
    const newPracticeText = onPracticeBackspaceFormat(practiceValue)

    setPractice(newPracticeText)
    const {
      ch: newCurrentCharObj,
      index: newCurrentCharObjIndex,
    } = getCurrentCharObjFromPractice(newPracticeText)

    if (newCurrentCharObj) {
      setCurrentDisplayCharIdx(newCurrentCharObjIndex)
    }

    return
  }

  const {
    ch: currentCharObj,
    index: currentCharObjIndex,
  } = getCurrentCharObjFromPractice()

  if (!currentCharObj) {
    console.warn('missing char obj')
    setPracticeHasError(false)

    return
  }

  setCurrentDisplayCharIdx(currentCharObjIndex)

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
