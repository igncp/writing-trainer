import React from 'react'

import { dummyServices } from '../../../../__stories__/storybookHelpers'
import RecordSave from '../RecordSave'

const RecordSaveStories = () => {
  return (
    <>
      <p>The link will automatically default to the current URL</p>
      <RecordSave
        initialRecord={null}
        onRecordSave={() => console.log('onRecordSave')}
        onShowRecordsList={() => console.log('onShowRecordsList')}
        services={dummyServices}
      />
    </>
  )
}

const Template = () => <RecordSaveStories />

const Common = Template.bind({})

export default {
  component: RecordSaveStories,
  title: 'Containers/RecordSave',
}

export { Common }
