import { T_CharsDisplayClickHandler } from '#/components/CharactersDisplay/CharactersDisplay'

import { getPronunciationOfTextFn } from '#/languages/common/commonLanguageUtils'
import {
  T_convertToCharsObjs,
  T_getFilteredTextToPracticeFn,
  T_handleWritingKeyDown,
  TCharObj,
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

  let pronunciationIdxOffset = 0
  const charsObjs: TCharObj[] = []

  for (let index = 0; index < textSegments.length; index += 1) {
    let pronunciationItem = ''
    const segment = textSegments[index]

    if (charsToRemove.indexOf(segment) === -1) {
      pronunciationItem =
        pronunciationArr[
          (index + pronunciationIdxOffset) % pronunciationArr.length
        ]
    } else {
      pronunciationIdxOffset -= 1
    }

    charsObjs.push({
      index,
      pronunciation: pronunciationItem,
      word: segment,
    })
  }

  return charsObjs
}

export const getPronunciationOfText = getPronunciationOfTextFn({
  SPECIAL_CHARS,
  charToPronunciationMap,
})

const privateFns = {
  sendCantodictFormForText: (text: string, id: string): void => {
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
    document.body.appendChild(form)

    // creating the 'formresult' window with custom features prior to submitting the form
    window.open('', `formresult${text}${id}`)
    form.submit()
    document.body.removeChild(form)
  },
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

  privateFns.sendCantodictFormForText(ch, 'single')

  const prev = charsObjs[index - 1]
  const next = charsObjs[index + 1]

  if (prev && prev.pronunciation) {
    privateFns.sendCantodictFormForText(prev.word + ch, 'left')
  }

  if (next && next.pronunciation) {
    privateFns.sendCantodictFormForText(ch + next.word, 'right')
  }
}

export const handleWritingKeyDown: T_handleWritingKeyDown = ({
  charsObjs,
  currentCharObj,
  keyEvent,
  languageOptions,
  originalTextValue,
  practiceValue,
  setPractice,
  setPracticeHasError,
  setWriting,
  specialCharsValue,
  writingValue,
}) => {
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

interface Test {
  privateFns?: typeof privateFns
}

const _test: Test = {
  privateFns: null,
}

// istanbul ignore else
if (__TEST__) {
  _test.privateFns = privateFns
}

export { _test }
