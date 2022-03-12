import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import Content from '../Content'

storiesOf('Containers|Content', module).add('common', () => {
  return (
    <div>
      <p>Some text to select</p>
      <Content onContentEnabledResult={action('Content Enabled Result')} />
    </div>
  )
})
