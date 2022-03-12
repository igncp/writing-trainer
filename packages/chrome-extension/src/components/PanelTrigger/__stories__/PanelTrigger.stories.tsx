import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import PanelTrigger from '../PanelTrigger'

storiesOf('Components|PanelTrigger', module).add('common', () => {
  return <PanelTrigger onClick={action('panel-trigger')} />
})
