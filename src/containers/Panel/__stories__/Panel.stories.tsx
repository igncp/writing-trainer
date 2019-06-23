import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Panel from '../Panel'

storiesOf('Containers|Panel', module)
  .add('mandarin', () => {
    return (
      <Panel onHideRequest={action('hide-request')} text="崩比筆,壁必畢.閉編" />
    )
  })
  .add('mandarin, long text', () => {
    const text = Array.from({ length: 5 })
      .map(() => '崩比筆,壁必畢.閉編')
      .join('')

    return (
      <Panel
        onHideRequest={action('hide-request')}
        text={text}
        _stories={{ defaultPractice: text.slice(0, text.length - 5) }}
      />
    )
  })
  .add('japanese', () => {
    return (
      <Panel
        onHideRequest={action('hide-request')}
        text="あいうえお"
        _stories={{ defaultLanguage: 'japanese' }}
      />
    )
  })
