import { cantoneseHandler } from '#/core'

import OptionsBlock from '../common/CharsOptions/OptionsBlock'
import { chineseBlurHandler } from '../common/chineseBlurHandler'
import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 繁體轉簡體 } from '../common/conversion'
import { 類型_語言UI處理程序, T_LangOpts, T_GetToneColor } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import { 類型_廣東話的langOpts } from './cantoneseTypes'
import dictionary from './converted-list-jy.yml'

const charToPronunciationMap: { [key: string]: string } = {}
const pronunciationToCharMap: { [key: string]: string } = {}

const dictionaryParsed = (
  dictionary as { dict: Array<undefined | string> }
).dict.reduce<Record<string, [string, number] | undefined>>((acc, item) => {
  const [char, pronunciation, perc] = item?.split('\t') ?? []

  if (!char || !pronunciation) {
    return acc
  }

  const finalPerc = perc ? parseFloat(perc.replace('%', '')) : 101
  const existing = acc[char]

  if (existing && existing[1] > finalPerc) {
    return acc
  }

  if (繁體轉簡體[char]) {
    繁體轉簡體[char]?.forEach(simplified => {
      acc[simplified] = [pronunciation, finalPerc]
    })
  }

  acc[char] = [pronunciation, finalPerc]

  return acc
}, {})

Object.keys(dictionaryParsed).forEach(char => {
  const item = dictionaryParsed[char]

  if (!item) return
  charToPronunciationMap[char] = item[0]
  pronunciationToCharMap[item[0]] = char
})

const langOpts基礎: T_LangOpts = {
  dictionary: charToPronunciationMap,
}

const getLangOpts = () => {
  if (typeof localStorage === 'undefined') {
    return {}
  }

  const rest = JSON.parse(localStorage.getItem('mandarinLangOpts') ?? '{}')

  return {
    ...langOpts基礎,
    ...rest,
  } satisfies T_LangOpts
}

const saveLangOptss = (opts: T_LangOpts) => {
  if (typeof localStorage === 'undefined') {
    return
  }

  const toSave = { ...opts }

  delete toSave.dictionary

  localStorage.setItem('mandarinLangOpts', JSON.stringify(toSave))
}

const 解析發音 = (文字: string, 選項: T_LangOpts) => {
  let 解析後的文本 = 文字.toLowerCase()

  if ((選項.聲調值 as 類型_廣東話的langOpts['聲調值']) === '不要使用聲調') {
    解析後的文本 = 解析後的文本.replace(/[0-9]/g, '')
  }

  return 解析後的文本
}

const handleKeyDown: 類型_語言UI處理程序['handleKeyDown'] = 參數 => {
  commonHandleWritingKeyDown(參數, {
    解析發音,
  })
}

const getToneColor: T_GetToneColor = (char, 選項, 字元) => {
  if (
    選項.useTonesColors === 'never' ||
    !字元?.pronunciation ||
    (選項.useTonesColors === 'current-error' && char !== 'current-error') ||
    (選項.useTonesColors === 'current' &&
      !['current', 'current-error'].includes(char)) ||
    !選項.useTonesColors
  ) {
    return undefined
  }

  const 音數 = Number(字元.pronunciation[字元.pronunciation.length - 1])

  if (Number.isNaN(音數)) {
    return undefined
  }

  return {
    1: 'var(--color-error-silver)',
    2: 'var(--color-error-green)',
    3: 'var(--color-error-pink)',
    4: 'var(--color-error-blue)',
    5: 'var(--color-error-orange)',
    6: 'var(--color-error-purple)',
  }[音數]
}

const languageUIController: 類型_語言UI處理程序 = {
  getLangOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  getToneColor,
  handleKeyDown,
  languageHandler: cantoneseHandler,
  onBlur: chineseBlurHandler,
  saveLangOptss,
  shouldAllCharsHaveSameWidth: false,
  tonesNumber: 6,
  處理清除事件: (處理程序: 類型_語言UI處理程序) => {
    處理程序.saveLangOptss({
      ...處理程序.getLangOpts(),
      charsWithMistakes: [],
    })
  },
}

export default languageUIController
