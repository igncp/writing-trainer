import { LanguageManager, japaneseHandler } from 'writing-trainer-core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { T_UIHandler, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'

const register = (languageManager: LanguageManager) => {
  languageManager.registerLanguage(japaneseHandler)
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
  id: japaneseHandler.language.id,
  register,
  shouldAllCharsHaveSameWidth: false,
}

export default uiHandler
