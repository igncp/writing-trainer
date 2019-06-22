import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import OptionsBlock from '../OptionsBlock'

storiesOf('Languages|Mandarin/OptionsBlock', module).add('common', () => {
  return <OptionsBlock onOptionsChange={action('options-change')} />
})
