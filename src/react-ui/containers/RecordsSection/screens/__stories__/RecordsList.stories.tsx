import { Record } from '#/core'

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
  records.push(
    new Record({
      createdOn: Date.now() - HOURS_10_IN_MS,
      id: x,
      language: x % 2 ? 'mandarin' : 'cantonese',
      lastLoadedOn: Date.now() - HOURS_10_IN_MS * Math.random(),
      link: x % 2 ? 'https://google.com' : '',
      name: `Name ${createRandomStr()} ${x}`,
      pronunciation: `Bar ${x}`,
      text: `Foo ${x}`,
    }),
  )
}

const RecordsListStories = () => {
  return (
    <RecordsList
      onRecordEdit={() => console.log('onRecordEdit')}
      onRecordLoad={() => console.log('onRecordLoad')}
      onRecordRemove={() => console.log('onRecordRemove')}
      onSongLoad={() => console.log('onSongLoad')}
      records={records}
      songs={[]}
    />
  )
}

const Template = () => <RecordsListStories />

const Common = Template.bind({})

export default {
  component: RecordsListStories,
  title: 'Containers/RecordsList',
}

export { Common }
