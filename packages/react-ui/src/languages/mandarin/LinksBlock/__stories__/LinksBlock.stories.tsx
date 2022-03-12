import * as React from 'react'

import { storiesOf } from '@storybook/react'

import LinksBlock from '../LinksBlock'

storiesOf('Languages|Mandarin/LinksBlock', module).add('common', () => {
  return <LinksBlock text="崩比筆,壁必畢.閉編">LinksBlock Text</LinksBlock>
})
