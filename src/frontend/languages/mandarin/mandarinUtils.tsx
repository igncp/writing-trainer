import { T_CharsDisplayClickHandler } from '#/components/CharactersDisplay/CharactersDisplay'

import { getPronunciationOfTextFn } from '#/languages/common/commonLanguageUtils'
import {
  T_convertToCharsObjs,
  T_getFilteredTextToPracticeFn,
  T_getWritingKeyDownHandler,
} from '#/languages/types'

import { LETTERS_AND_NUMBERS, SPECIAL_CHARS } from '../common/specialCharacters'

import dictionary from './converted-list-ma.csv'
import { T_MandarinLanguageOptions } from './mandarinTypes'

const charToPronunciationMap: { [key: string]: string } = {}
const pronunciationToCharMap: { [key: string]: string } = {}

dictionary.forEach(([char, pronunciation]: [string, string]) => {
  charToPronunciationMap[char] = pronunciation
  pronunciationToCharMap[pronunciation] = char
})

const CANTODICT_LINK =
  'http://www.cantonese.sheik.co.uk/scripts/wordsearch.php?level=0'

export { SPECIAL_CHARS }

export const getFilteredTextToPracticeFn: T_getFilteredTextToPracticeFn = extraSpecialChars => {
  const specialCharsArr = SPECIAL_CHARS.concat(LETTERS_AND_NUMBERS)
    .concat(extraSpecialChars)
    .split('')

  return str => {
    const getIsNotSpecialChar = (chr: string) => {
      return !specialCharsArr.find(c => c === chr)
    }

    return str
      .split('\n')
      .map(s => s.trim().replace(/[ ]/gm, ''))
      .join('')
      .split('')
      .filter(getIsNotSpecialChar)
      .join('')
  }
}

export const convertToCharsObjs: T_convertToCharsObjs = ({
  pronunciation,
  text,
  charsToRemove,
}) => {
  const pronunciationArr = pronunciation.split(' ').filter((c: string) => !!c)
  const textSegments = text.split('').filter(c => !!c)
  const textSegmentsFiltered = textSegments.filter(
    c => charsToRemove.indexOf(c) === -1
  )

  if (pronunciationArr.length !== textSegmentsFiltered.length) {
    return []
  }

  let pronunciationIdxOffset = 0

  return textSegments.map((segment, idx) => {
    let pronunciationItem = ''

    if (charsToRemove.indexOf(segment) === -1) {
      pronunciationItem = pronunciationArr[idx + pronunciationIdxOffset]
    } else {
      pronunciationIdxOffset -= 1
    }

    return {
      pronunciation: pronunciationItem,
      word: segment,
    }
  })
}

export const getPronunciationOfText = getPronunciationOfTextFn({
  SPECIAL_CHARS,
  charToPronunciationMap,
})

const sendCantodictFormForText = (text: string, id: string): void => {
  const form = document.createElement('form')

  form.setAttribute('method', 'POST')
  form.setAttribute('action', CANTODICT_LINK)
  form.setAttribute('target', `formresult${text}${id}`)
  form.style.display = 'none'

  const i1 = document.createElement('input')
  const i2 = document.createElement('input')
  const i3 = document.createElement('input')
  const i4 = document.createElement('input')

  i1.setAttribute('name', 'TEXT')
  i1.setAttribute('value', text)
  i2.setAttribute('name', 'SEARCHTYPE')
  i2.setAttribute('value', text.length === 1 ? '0' : '1')
  i3.setAttribute('name', 'radicaldropdown')
  i3.setAttribute('value', '0')
  i4.setAttribute('name', 'searchsubmit')
  i4.setAttribute('value', '1')

  form.appendChild(i1)
  form.appendChild(i2)
  form.appendChild(i3)
  form.appendChild(i4)
  ;(document.body as any).appendChild(form)

  // creating the 'formresult' window with custom features prior to submitting the form
  window.open('', `formresult${text}${id}`)
  form.submit()
  ;(document.body as any).removeChild(form)
}

export const handleDisplayedCharClick: T_CharsDisplayClickHandler = ({
  charObj,
  charsObjs,
  index,
}) => {
  if (!charObj || !charObj.pronunciation) {
    return
  }

  const ch = charObj.word

  sendCantodictFormForText(ch, 'single')

  const prev = charsObjs[index - 1]
  const next = charsObjs[index + 1]

  if (prev && prev.pronunciation) {
    sendCantodictFormForText(prev.word + ch, 'left')
  }

  if (next && next.pronunciation) {
    sendCantodictFormForText(ch + next.word, 'right')
  }
}

export const getWritingKeyDownHandler: T_getWritingKeyDownHandler = ({
  charsObjs,
  getCurrentPracticeWord,
  languageOptions,
  originalTextValue,
  practiceValue,
  setPractice,
  setPracticeHasError,
  setWriting,
  specialCharsValue,
  writingValue,
}) => e => {
  if (e.key === 'Backspace' && writingValue.length === 0) {
    setPractice(practiceValue.slice(0, practiceValue.length - 1))
  }

  // special key
  if (e.key === '`') {
    e.preventDefault()
    setWriting('')
    setPracticeHasError(false)

    return
  }

  if (e.key === 'Enter') {
    setPractice(`${practiceValue}\n`)
  }

  // including capital letters so it doesn't write when shortcut
  if (!/[a-z0-9A-Z]/.test(e.key)) {
    e.preventDefault()

    setPractice(practiceValue + e.key)

    return
  }

  const currentPracticeWord = getCurrentPracticeWord({
    extractFn: getFilteredTextToPracticeFn,
    origText: originalTextValue,
    practiceText: practiceValue,
    specialChars: specialCharsValue,
  })

  if (!currentPracticeWord) {
    setPracticeHasError(false)

    return
  }

  const currentCharObj = charsObjs.find(ch => ch.word === currentPracticeWord)

  if (!currentCharObj) {
    console.warn('missing char obj')
    setPracticeHasError(false)

    return
  }

  if (e.key.length !== 1 && e.key !== 'Backspace') {
    e.preventDefault()

    return
  }

  e.preventDefault()

  const { pronunciation: correctPronunciation } = currentCharObj

  const newWritingValue =
    e.key === 'Backspace'
      ? writingValue.slice(0, writingValue.length - 1)
      : writingValue + e.key

  const { tonesValue } = languageOptions as T_MandarinLanguageOptions
  const parsedCorrectPronunciation =
    tonesValue === 'with-tones'
      ? correctPronunciation
      : correctPronunciation.replace(/[0-9]$/, '')

  if (parsedCorrectPronunciation === newWritingValue) {
    setWriting('')
    setPracticeHasError(false)
    setPractice(practiceValue + currentCharObj.word)

    return
  }

  setWriting(newWritingValue)

  setPracticeHasError(!correctPronunciation.startsWith(newWritingValue))
}
