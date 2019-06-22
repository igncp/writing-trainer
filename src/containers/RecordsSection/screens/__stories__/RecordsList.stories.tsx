import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Record } from '../../recordsTypes'

import RecordsList from '../RecordsList'

const characters = 'abcdefghijklmnopqrstuvwxyz'
const charactersLength = characters.length

const createRandomStr = () => {
  let result = ''

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

const records: Record[] = []

const HOURS_10_IN_MS = 1000 * 60 * 60 * 10

for (let x = 0; x <= 50; x++) {
  records.push({
    createdOn: Date.now() - HOURS_10_IN_MS,
    id: x,
    language: x % 2 ? 'mandarin' : 'cantonese',
    lastLoadedOn: Date.now() - HOURS_10_IN_MS * Math.random(),
    link: x % 2 ? 'https://google.com' : '',
    name: `Name ${createRandomStr()} ${x}`,
    pronunciation: `Bar ${x}`,
    text: `Foo ${x}`,
  })
}

storiesOf('Containers|RecordsList', module).add('common', () => {
  return (
    <RecordsList
      records={records}
      onRecordRemove={action('onRecordRemove')}
      onRecordLoad={action('onRecordLoad')}
    />
  )
})
