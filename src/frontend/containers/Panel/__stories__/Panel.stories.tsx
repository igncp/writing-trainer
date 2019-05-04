import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Panel from '../Panel'

storiesOf('Containers|Panel', module).add('common', () => {
  return (
    <Panel onHideRequest={action('hide-request')} text="崩比筆,壁必畢.閉編" />
  )
})
