import { japaneseHandler } from '#/core'

import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils'
import { 類型_語言UI處理程序, 類型_語言選項 } from '../types'

import OptionsBlock from './OptionsBlock/OptionsBlock'
import 連結區塊 from './連結區塊/連結區塊'

const 處理寫鍵按下: 類型_語言UI處理程序['處理寫鍵按下'] = params => {
  commonHandleWritingKeyDown(params, {})
}

const 語言選項: 類型_語言選項 = {}

const 語言UI處理程序: 類型_語言UI處理程序 = {
  getOptionsBlock: () => OptionsBlock,
  languageHandler: japaneseHandler,
  shouldAllCharsHaveSameWidth: false,
  儲存語言選項: () => {},
  取得語言選項: () => 語言選項,
  取得連結區塊: () => 連結區塊,
  處理寫鍵按下,
}

export default 語言UI處理程序
