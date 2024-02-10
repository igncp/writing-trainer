import React from 'react'

import 按鈕 from '../../../components/按鈕/按鈕'
import { copyTextToClipboard } from '../../../utils/general'
import GTButton from '../../common/Links/GoogleTranslateButton'
import { T_LinksBlock } from '../../types'

const MANDARIN_CONVERTER_LINK =
  'https://www.chineseconverter.com/en/convert/chinese-to-pinyin'

const linkStyle = {
  margin: '10px auto',
}

const LinksBlock: T_LinksBlock = ({ text }) => {
  const hrefText = text
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  return (
    <div style={{ width: '100%' }}>
      <GTButton language="zh-CN" style={{ paddingLeft: '0' }} text={text} />
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

export default LinksBlock
