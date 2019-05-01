import { storiesOf } from '@storybook/react'
import * as React from 'react'

import TextArea from '../TextArea'

storiesOf('Components|TextArea', module).add('common', () => {
  return <TextArea rows={1}>Content</TextArea>
})
