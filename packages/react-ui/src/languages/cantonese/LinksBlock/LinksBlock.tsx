import React from 'react'

import Button from '../../../components/Button/Button'
import { copyTextToClipboard } from '../../../utils/general'
import GTButton from '../../common/Links/GoogleTranslateButton'
import { T_LinksBlock } from '../../types'

const CANTONESE_CONVERTER_LINK =
  'https://www.cantonesetools.org/en/cantonese-to-jyutping'

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
      <GTButton language="zh-HK" style={{ paddingLeft: 0 }} text={text} />
      <Button
        onClick={() => {
          copyTextToClipboard(hrefText)
          window.open(CANTONESE_CONVERTER_LINK)
        }}
        style={linkStyle}
      >
        Pronunciation
      </Button>
    </div>
  )
}

export default LinksBlock
