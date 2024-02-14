import { japaneseHandler } from 'writing-trainer-core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { T_UIHandler, 類型_語言選項 } from '../types'

import OptionsBlock from './OptionsBlock/OptionsBlock'
import 連結區塊 from './連結區塊/連結區塊'

const handleWritingKeyDown: T_UIHandler['handleWritingKeyDown'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const 語言選項: 類型_語言選項 = {}

const uiHandler: T_UIHandler = {
  getDisplayedCharHandler: () => null,
  getOptionsBlock: () => OptionsBlock,
  handleWritingKeyDown,
  languageHandler: japaneseHandler,
  shouldAllCharsHaveSameWidth: false,
  儲存語言選項: () => {},
  取得語言選項: () => 語言選項,
  取得連結區塊: () => 連結區塊,
}

export default uiHandler
