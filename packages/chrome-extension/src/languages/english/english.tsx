import { languageManager } from 'writing-trainer-core'
import englishHandler from 'writing-trainer-core/dist/languageHandlers/english'

import { T_UIHandler, T_LangOpts } from '#/languages/types'
import { commonHandleWritingKeyDown } from '#/languages/common/commonLanguageUtils'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock'

const register = () => {
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
  id: englishHandler.id,
  register,
  shouldAllCharsHaveSameWidth: false,
}

let _test:
  | undefined
  | {
      langOpts: typeof langOpts
    }

// istanbul ignore else
if (__TEST__) {
  _test = {
    langOpts,
  }
}

export { _test }

export default uiHandler
