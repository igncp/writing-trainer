import { japaneseHandler } from '#/core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 類型_語言UI處理程序, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'

const handleKeyDown: 類型_語言UI處理程序['handleKeyDown'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const langOpts: T_LangOpts = {}

const languageUIController: 類型_語言UI處理程序 = {
  getLangOpts: () => langOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleKeyDown,
  languageHandler: japaneseHandler,
  saveLangOptss: () => {},
  shouldAllCharsHaveSameWidth: false,
}

export default languageUIController
