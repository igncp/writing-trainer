import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import RecordSave from '../RecordSave'

storiesOf('Containers|RecordSave', module).add('common', () => {
  return (
    <React.Fragment>
      <p>The link will automatically default to the current URL</p>
      <RecordSave
        initialRecord={null}
        onRecordSave={action('onRecordSave')}
        onShowRecordsList={action('onShowRecordsList')}
      />
    </React.Fragment>
  )
})
