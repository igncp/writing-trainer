import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import RecordSave from '../RecordSave'

storiesOf('Containers|RecordSave', module).add('common', () => {
  return <RecordSave onRecordSave={action('onRecordSave')} />
})
