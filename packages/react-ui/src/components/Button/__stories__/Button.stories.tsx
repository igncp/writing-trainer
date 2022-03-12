import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import Button from '../Button'

storiesOf('Components|Button', module).add('common', () => {
  return <Button onClick={action('clicked')}>Button Text</Button>
})
