import React from 'react'

import Button from '#/components/Button/Button'
import { copyTextToClipboard } from '#/utils/general'

import { TLinksBlock } from '#/languages/types'

const MANDARIN_CONVERTER_LINK =
  'https://www.chineseconverter.com/en/convert/chinese-to-pinyin'

const linkStyle = {
  marginRight: 10,
}

const LinksBlock: TLinksBlock = ({ text }) => {
  const hrefText = text
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  return (
    <div style={{ width: '100%' }}>
      <Button
        style={linkStyle}
        shouldUseLink
        href={`https://translate.google.com/#zh-CN/en/${hrefText}`}
      >
        Google Translate
      </Button>
      <Button
        style={linkStyle}
        onClick={() => {
          copyTextToClipboard(hrefText)
          window.open(MANDARIN_CONVERTER_LINK)
        }}
      >
        Pronunciation
      </Button>
    </div>
  )
}

export default LinksBlock
