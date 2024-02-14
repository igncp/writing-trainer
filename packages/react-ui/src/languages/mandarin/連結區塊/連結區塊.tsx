import React from 'react'

import 按鈕 from '../../../components/按鈕/按鈕'
import { copyTextToClipboard } from '../../../utils/general'
import GTButton from '../../common/Links/GoogleTranslateButton'
import { 類型_連結區塊 } from '../../types'

const MANDARIN_CONVERTER_LINK =
  'https://www.chineseconverter.com/en/convert/chinese-to-pinyin'

const linkStyle = {
  margin: '10px auto',
}

const 連結區塊: 類型_連結區塊 = ({ 文字 }) => {
  const hrefText = 文字
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  return (
    <div style={{ width: '100%' }}>
      <GTButton language="zh-CN" style={{ paddingLeft: '0' }} text={文字} />
      <按鈕
        onClick={() => {
          copyTextToClipboard(hrefText)
          window.open(MANDARIN_CONVERTER_LINK)
        }}
        style={linkStyle}
      >
        發音
      </按鈕>
    </div>
  )
}

export default 連結區塊
