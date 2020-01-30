import React from 'react'

import Button from '#/components/Button/Button'
import GTButton from '#/languages/common/Links/GoogleTranslateButton'
import { copyTextToClipboard } from '#/utils/general'

import { T_LinksBlock } from '#/languages/types'

const MANDARIN_CONVERTER_LINK =
  'https://www.chineseconverter.com/en/convert/chinese-to-pinyin'

const linkStyle = {
  marginRight: 10,
}

const LinksBlock: T_LinksBlock = ({ text }) => {
  const hrefText = text
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  return (
    <div style={{ width: '100%' }}>
      <GTButton language="zh-CN" style={linkStyle} text={text} />
      <Button
        onClick={() => {
          copyTextToClipboard(hrefText)
          window.open(MANDARIN_CONVERTER_LINK)
        }}
        style={linkStyle}
      >
        Pronunciation
      </Button>
    </div>
  )
}

export default LinksBlock
