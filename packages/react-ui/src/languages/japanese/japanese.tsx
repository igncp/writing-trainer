import { japaneseHandler } from 'writing-trainer-core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { T_UIHandler, 類型_語言選項 } from '../types'

import LinksBlock from './LinksBlock/LinksBlock'
import OptionsBlock from './OptionsBlock/OptionsBlock'

const handleWritingKeyDown: T_UIHandler['handleWritingKeyDown'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const 語言選項: 類型_語言選項 = {}

const uiHandler: T_UIHandler = {
  getDisplayedCharHandler: () => null,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleWritingKeyDown,
  languageHandler: japaneseHandler,
  shouldAllCharsHaveSameWidth: false,
  儲存語言選項: () => {},
  取得語言選項: () => 語言選項,
}

export default uiHandler
