import { japaneseHandler } from '#/core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 類型_語言UI處理程序, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'

const 處理寫鍵按下: 類型_語言UI處理程序['處理寫鍵按下'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const langOpts: T_LangOpts = {}

const 語言UI處理程序: 類型_語言UI處理程序 = {
  getLangOpts: () => langOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  languageHandler: japaneseHandler,
  saveLangOptss: () => {},
  shouldAllCharsHaveSameWidth: false,
  處理寫鍵按下,
}

export default 語言UI處理程序
