import { englishHandler } from '#/core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 類型_語言UI處理程序, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock'

const 處理寫鍵按下: 類型_語言UI處理程序['處理寫鍵按下'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const langOpts: T_LangOpts = {}

const getLangOpts = () => langOpts

const saveLangOptss = () => {}

const 語言UI處理程序: 類型_語言UI處理程序 = {
  getLangOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  languageHandler: englishHandler,
  saveLangOptss,
  shouldAllCharsHaveSameWidth: false,
  處理寫鍵按下,
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

export default 語言UI處理程序
