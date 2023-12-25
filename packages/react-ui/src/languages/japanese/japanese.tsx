import { japaneseHandler } from 'writing-trainer-core'

import { commonHandleWritingKeyDown } from '../common/commonHandleWritingKeyDown'
import { T_UIHandler, T_LangOpts } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'

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
  languageHandler: japaneseHandler,
  shouldAllCharsHaveSameWidth: false,
}

export default uiHandler
