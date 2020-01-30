import React from 'react'

import GTButton from '#/languages/common/Links/GoogleTranslateButton'

import { T_LinksBlock } from '#/languages/types'

const LinksBlock: T_LinksBlock = ({ text }) => {
  return (
    <div style={{ width: '100%' }}>
      <GTButton language="ja" text={text} />
    </div>
  )
}

export default LinksBlock
