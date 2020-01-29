import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Popup from '../Popup'

storiesOf('Containers|Popup', module).add('common', () => {
  return (
    <Popup
      onEnableOnceClick={action('onEnableOnceClick')}
      onOptionsPageClick={action('onOptionsPageClick')}
    />
  )
})
