import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import OptionsBlock from '../OptionsBlock'

storiesOf('Languages|Japanese/OptionsBlock', module).add('common', () => {
  return (
    <div>
      <p>The options block for Japanese is empty at the moment</p>
      <OptionsBlock
        languageOptions={{}}
        onOptionsChange={action('options-change')}
      />
    </div>
  )
})
