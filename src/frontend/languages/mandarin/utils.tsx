import { T_CharsDisplayClickHandler } from '../../components/CharactersDisplay/CharactersDisplay'

import * as dictionary from './converted-list-ma.csv'
import specialCharactersList from './specialCharacters'

export const charToPronunciationMap: { [key: string]: string } = {}
export const pronunciationToCharMap: { [key: string]: string } = {}

dictionary.forEach(([char, pronunciation]: [string, string]) => {
  charToPronunciationMap[char] = pronunciation
  pronunciationToCharMap[pronunciation] = char
})

export const SPECIAL_CHARS = specialCharactersList.join('')

export const LETTERS_AND_NUMBERS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const CANTODICT_LINK =
  'http://www.cantonese.sheik.co.uk/scripts/wordsearch.php?level=0'

type T_getChineseCharsOnlyTextFn = (s: string) => (s: string) => string

export const getChineseCharsOnlyTextFn: T_getChineseCharsOnlyTextFn = extraSpecialChars => {
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

type T_convertToCharsObjs = (opts: {
  pronunciation: string
  text: string
  charsToRemove: string
}) => Array<{
  word: string
  pronunciation: string
}>

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

type T_getPronunciationOfText = (opts: {
  text: string
  charsToRemove: string
}) => string

export const getPronunciationOfText: T_getPronunciationOfText = ({
  text,
  charsToRemove,
}) => {
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
  index,
  charObj,
  charsObjs,
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
