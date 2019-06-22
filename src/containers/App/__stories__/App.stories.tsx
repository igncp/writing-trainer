import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import App from '../App'

storiesOf('Containers|App', module).add('common', () => {
  return (
    <div>
      <p>Some text to select</p>
      <App onAppEnabledResult={action('App Enabled Result')} />
    </div>
  )
})
