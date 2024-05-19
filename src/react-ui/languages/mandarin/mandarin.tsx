import { CurrentCharObj, mandarinHandler } from '#/core'

import OptionsBlock from '../common/CharsOptions/OptionsBlock'
import { chineseBlurHandler } from '../common/chineseBlurHandler'
import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 繁體轉簡體 } from '../common/conversion'
import { 類型_語言UI處理程序, 類型_語言選項 } from '../types'

import dictionary from './converted-list-ma.yml'
import { 類型_普通話的語言選項 } from './mandarinTypes'
import 連結區塊 from './連結區塊/連結區塊'

const charToPronunciationMap: { [key: string]: string } = {}
const pronunciationToCharMap: { [key: string]: string } = {}

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

  if ((選項.聲調值 as 類型_普通話的語言選項['聲調值']) === '不要使用聲調') {
    解析後的文本 = 解析後的文本.replace(/[0-9]/g, '')
  }

  return 解析後的文本
}

const 處理寫鍵按下: 類型_語言UI處理程序['處理寫鍵按下'] = 參數 => {
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

const 取得錯誤顏色 = (選項: 類型_語言選項, 字元: CurrentCharObj | null) => {
  if (選項.使用聲調的顏色 === false || !字元?.ch.pronunciation) {
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

const 語言UI處理程序: 類型_語言UI處理程序 = {
  getOptionsBlock: () => OptionsBlock,
  languageHandler: mandarinHandler,
  onBlur: chineseBlurHandler,
  shouldAllCharsHaveSameWidth: false,
  儲存語言選項,
  取得語言選項,
  取得連結區塊: () => 連結區塊,
  取得錯誤顏色,
  處理寫鍵按下,
  處理清除事件: (處理程序: 類型_語言UI處理程序) => {
    處理程序.儲存語言選項({ ...處理程序.取得語言選項(), 錯誤的字符: [] })
  },
}

export default 語言UI處理程序
