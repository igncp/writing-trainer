import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import TextInput from '../TextInput'

storiesOf('Components|TextInput', module).add('common', () => {
  return <TextInput onEnterPress={action('onEnterPress')} />
})
