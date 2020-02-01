import { languageManager } from 'writing-trainer-core'
import mandarinHandler from 'writing-trainer-core/dist/languageHandlers/mandarin'

import {
  T_UIHandler,
  T_LangOpts,
  T_CharsDisplayClickHandler,
} from '#/languages/types'
import { commonHandleWritingKeyDown } from '#/languages/common/commonLanguageUtils'

import { T_MandarinLanguageOptions } from './mandarinTypes'
import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'
import dictionary from './converted-list-ma.csv'

const charToPronunciationMap: { [key: string]: string } = {}
const pronunciationToCharMap: { [key: string]: string } = {}

const CANTODICT_LINK =
  'http://www.cantonese.sheik.co.uk/scripts/wordsearch.php?level=0'

dictionary.forEach(([char, pronunciation]: [string, string]) => {
  charToPronunciationMap[char] = pronunciation
  pronunciationToCharMap[pronunciation] = char
})

const register = () => {
  languageManager.registerLanguage(mandarinHandler)
}

const parsePronunciation = (text: string, opts: T_LangOpts) => {
  let parsedText = text.toLowerCase()

  if (
    (opts?.tonesValue as T_MandarinLanguageOptions['tonesValue']) ===
    'without-tones'
  ) {
    parsedText = parsedText.replace(/[0-9]/g, '')
  }

  return parsedText
}

const handleWritingKeyDown: T_UIHandler['handleWritingKeyDown'] = params => {
  commonHandleWritingKeyDown(params, {
    parsePronunciation,
  })
}

const langOpts: T_LangOpts = {
  dictionary: charToPronunciationMap,
}

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

const uiHandler: T_UIHandler = {
  getDisplayedCharHandler: () => handleDisplayedCharClick,
  getLangOpts: () => langOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleWritingKeyDown,
  id: mandarinHandler.id,
  register,
  shouldAllCharsHaveSameWidth: false,
}

export default uiHandler
