import { CurrentCharObj, mandarinHandler } from 'writing-trainer-core'

import OptionsBlock from '../common/CharsOptions/OptionsBlock'
import { chineseBlurHandler } from '../common/chineseBlurHandler'
import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 繁體轉簡體 } from '../common/conversion'
import {
  T_UIHandler,
  類型_語言選項,
  T_CharsDisplayClickHandler,
} from '../types'

import dictionary from './converted-list-ma.yml'
import { 類型_普通話的語言選項 } from './mandarinTypes'
import 連結區塊 from './連結區塊/連結區塊'

const charToPronunciationMap: { [key: string]: string } = {}
const pronunciationToCharMap: { [key: string]: string } = {}

const CANTODICT_LINK =
  'http://www.cantonese.sheik.co.uk/scripts/wordsearch.php?level=0'

const dictionaryParsed = (
  dictionary as { dict: Array<undefined | string> }
).dict.reduce<Record<string, [string, number] | undefined>>((acc, item) => {
  const [char, pronunciation, perc] = item?.split('\t') ?? []

  if (!char || !pronunciation) {
    return acc
  }

  const finalPerc = perc ? parseFloat(perc.replace('%', '')) : 0
  const existing = acc[char]

  if (existing && existing[1] > finalPerc) {
    return acc
  }

  acc[char] = [pronunciation, finalPerc]

  if (繁體轉簡體[char]) {
    繁體轉簡體[char]?.forEach(simplified => {
      acc[simplified] = [pronunciation, finalPerc]
    })
  }

  return acc
}, {})

Object.keys(dictionaryParsed).forEach(char => {
  const item = dictionaryParsed[char]

  if (!item) return
  charToPronunciationMap[char] = item[0]
  pronunciationToCharMap[item[0]] = char
})

const 解析發音 = (文字: string, 選項: 類型_語言選項) => {
  let 解析後的文本 = 文字.toLowerCase()

  if (
    !選項.聲調值 ||
    (選項.聲調值 as 類型_普通話的語言選項['聲調值']) === '不要使用聲調'
  ) {
    解析後的文本 = 解析後的文本.replace(/[0-9]/g, '')
  }

  return 解析後的文本
}

const handleWritingKeyDown: T_UIHandler['handleWritingKeyDown'] = 參數 => {
  commonHandleWritingKeyDown(參數, {
    解析發音,
  })
}

const 語言選項基礎: 類型_語言選項 = {
  dictionary: charToPronunciationMap,
}

const 取得語言選項 = () => {
  if (typeof localStorage === 'undefined') {
    return {}
  }

  const rest = JSON.parse(localStorage.getItem('mandarinLangOpts') ?? '{}')

  return {
    ...語言選項基礎,
    ...rest,
  } satisfies 類型_語言選項
}

const 儲存語言選項 = (opts: 類型_語言選項) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  const toSave = { ...opts }

  delete toSave.dictionary

  localStorage.setItem('mandarinLangOpts', JSON.stringify(toSave))
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
  字元對象,
  字元對象列表,
  索引,
}) => {
  if (!(字元對象 as unknown) || !字元對象.pronunciation) {
    return
  }

  const ch = 字元對象.word

  privateFns.sendCantodictFormForText(ch, 'single')

  const prev = 字元對象列表[索引 - 1]
  const next = 字元對象列表[索引 + 1]

  if ((prev as unknown) && prev.pronunciation) {
    privateFns.sendCantodictFormForText(prev.word + ch, 'left')
  }

  if ((next as unknown) && next.pronunciation) {
    privateFns.sendCantodictFormForText(ch + next.word, 'right')
  }
}

const 取得錯誤顏色 = (選項: 類型_語言選項, 字元: CurrentCharObj | null) => {
  if (!選項.使用聲調的顏色 || !字元?.ch.pronunciation) {
    return undefined
  }

  const 音數 = Number(字元.ch.pronunciation[字元.ch.pronunciation.length - 1])

  if (Number.isNaN(音數)) {
    return undefined
  }

  return {
    1: 'var(--color-error-silver)',
    2: 'var(--color-error-green)',
    3: 'var(--color-error-red)',
    4: 'var(--color-error-blue)',
    5: 'var(--color-error-yellow)',
  }[音數]
}

const uiHandler: T_UIHandler = {
  getDisplayedCharHandler: () => handleDisplayedCharClick,
  getOptionsBlock: () => OptionsBlock,
  handleWritingKeyDown,
  languageHandler: mandarinHandler,
  onBlur: chineseBlurHandler,
  shouldAllCharsHaveSameWidth: false,
  儲存語言選項,
  取得語言選項,
  取得連結區塊: () => 連結區塊,
  取得錯誤顏色,
}

export default uiHandler
