import React from 'react'

import Button from '#/components/Button/Button'

import { Record } from '../recordsTypes'

type RecordsList = React.FC<{
  records: Record[]
  onRecordRemove(r: Record): void
}>

const RecordsList: RecordsList = ({ records, onRecordRemove }) => {
  return (
    <div>
      {records.map(record => {
        const { id, name, timestamp = 0 } = record

        return (
          <div key={id}>
            <div style={{ display: 'inline-block' }}>Name: {name}</div>
            <div style={{ display: 'inline-block' }}>
              Time: {new Date(timestamp).toString()}
            </div>
            <Button
              onClick={() => {
                onRecordRemove(record)
              }}
            >
              Remove
            </Button>
          </div>
        )
      })}
    </div>
  )
}

export default RecordsList
