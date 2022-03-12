import * as React from 'react'

import { storiesOf } from '@storybook/react'

import LinksBlock from '../LinksBlock'

storiesOf('Languages|Japanese/LinksBlock', module).add('common', () => {
  return (
    <div>
      <p>The links block for japanese is empty at the moment</p>
      <LinksBlock text="崩比筆,壁必畢.閉編">LinksBlock Text</LinksBlock>
    </div>
  )
})
