import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import OptionsBlock from '../OptionsBlock'

storiesOf('Languages|Mandarin/OptionsBlock', module).add('common', () => {
  return (
    <OptionsBlock
      languageOptions={{}}
      onOptionsChange={action('options-change')}
    />
  )
})
