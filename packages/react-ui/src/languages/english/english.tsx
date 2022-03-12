import { LanguageManager, englishHandler } from 'writing-trainer-core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { T_UIHandler, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock'

const register = (languageManager: LanguageManager) => {
  languageManager.registerLanguage(englishHandler)
}

const handleWritingKeyDown: T_UIHandler['handleWritingKeyDown'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const langOpts: T_LangOpts = {}

const uiHandler: T_UIHandler = {
  getDisplayedCharHandler: () => null,
  getLangOpts: () => langOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleWritingKeyDown,
  id: englishHandler.language.id,
  register,
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

export default uiHandler
