import { englishHandler } from '#/core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 類型_語言UI處理程序, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock'

const handleKeyDown: 類型_語言UI處理程序['handleKeyDown'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const langOpts: T_LangOpts = {}

const getLangOpts = () => langOpts

const saveLangOptss = () => {}

const languageUIController: 類型_語言UI處理程序 = {
  getLangOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleKeyDown,
  languageHandler: englishHandler,
  saveLangOptss,
  shouldAllCharsHaveSameWidth: false,
}

let _test:
  | {
      langOpts: typeof langOpts
    }
  | undefined

// istanbul ignore else
if (__TEST__) {
  _test = {
    langOpts,
  }
}

export { _test }

export default languageUIController
