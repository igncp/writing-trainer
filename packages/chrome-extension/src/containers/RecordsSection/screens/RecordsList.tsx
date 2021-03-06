import React, { useState } from 'react'
import { records as coreRecords } from 'writing-trainer-core'

import Button from '#/components/Button/Button'
import TextInput from '#/components/TextInput/TextInput'

const { filterRecords } = coreRecords

type T_Record = coreRecords.T_Record

type Cell = React.FC<{
  bold?: boolean
  label?: string
  title?: string
  value: string
}>

const Cell: Cell = ({ label, value, title, bold }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        marginRight: 30,
        ...(bold ? { fontWeight: 700 } : {}),
      }}
      {...(title ? { title } : {})}
    >
      {label && (
        <React.Fragment>
          <b>{label}</b>:{' '}
        </React.Fragment>
      )}
      {value}
    </div>
  )
}

const formatRecordDate = (d: number): string => {
  const date = new Date(d)

  const dateStr = date.toLocaleDateString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  })

  return `[${dateStr}]`
}

type RecordsList = React.FC<{
  onRecordEdit(r: T_Record): void
  onRecordLoad(r: T_Record): void
  onRecordRemove(r: T_Record): void
  records: T_Record[]
}>

const RecordsList: RecordsList = ({
  onRecordEdit,
  onRecordLoad,
  onRecordRemove,
  records,
}) => {
  const [filterValue, setFilterValue] = useState<string>('')
  const filteredRecords = filterRecords({
    filterText: filterValue,
    records,
  })

  return (
    <div>
      {records.length > 0 && (
        <div style={{ padding: 10, position: 'relative' }}>
          <TextInput
            autoFocus
            onChange={e => {
              setFilterValue(e.target.value)
            }}
            onEnterPress={() => {
              if (filteredRecords.length > 0) {
                onRecordLoad(filteredRecords[0])
              }
            }}
            placeholder="Filter by name and language"
            style={{ width: '100%' }}
          />
        </div>
      )}
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {filteredRecords.map(record => {
          const { id, name, createdOn, lastLoadedOn } = record

          return (
            <div key={id} style={{ padding: 10 }}>
              <Cell label="Name" value={name} />
              <Cell title="Created" value={formatRecordDate(createdOn)} />
              <Cell title="Loaded" value={formatRecordDate(lastLoadedOn)} />
              <Cell bold title="Language" value={record.language} />
              {record.link && (
                <a
                  href={record.link}
                  style={{ marginRight: 15 }}
                  target="_blank"
                  title={record.link}
                >
                  Website
                </a>
              )}
              <Button
                onClick={() => {
                  onRecordLoad(record)
                }}
              >
                Load
              </Button>
              <Button
                onClick={() => {
                  onRecordEdit(record)
                }}
              >
                Edit
              </Button>
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
    </div>
  )
}

export default RecordsList
