import { LanguageManager } from 'writing-trainer-core'
import japaneseHandler from 'writing-trainer-core/dist/languageHandlers/japanese'

import { T_UIHandler, T_LangOpts } from '../types'
import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'

const register = (languageManager: LanguageManager) => {
  languageManager.registerLanguage(japaneseHandler)
}

const handleWritingKeyDown: T_UIHandler['handleWritingKeyDown'] = (params) => {
  commonHandleWritingKeyDown(params, {})
}

const langOpts: T_LangOpts = {}

const uiHandler: T_UIHandler = {
  getDisplayedCharHandler: () => null,
  getLangOpts: () => langOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleWritingKeyDown,
  id: japaneseHandler.id,
  register,
  shouldAllCharsHaveSameWidth: false,
}

export default uiHandler
