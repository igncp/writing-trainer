import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import PanelCloseButton from '../PanelCloseButton'

storiesOf('Components|PanelCloseButton', module).add('common', () => {
  return <PanelCloseButton onClick={action('clicked')} />
})
