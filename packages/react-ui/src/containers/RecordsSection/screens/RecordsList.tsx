import React, { useState } from 'react'
import { Record } from 'writing-trainer-core'

import Button from '../../../components/Button/Button'
import TextInput from '../../../components/TextInput/TextInput'

type CellProps = {
  bold?: boolean
  label?: string
  title?: string
  value: string
}

const Cell = ({ bold, label, title, value }: CellProps) => {
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

type Song = {
  artist: string
  lang: string
  load: () => Promise<{ lyrics: string[] }>
  name: string
  video: string
}

type RecordsListProps = {
  onRecordEdit: (r: Record) => void
  onRecordLoad: (r: Record) => void
  onRecordRemove: (r: Record) => void
  onSongLoad: (s: string[]) => void
  records: Record[]
  songs: Song[]
}

const RecordsList = ({
  onRecordEdit,
  onRecordLoad,
  onRecordRemove,
  onSongLoad,
  records,
  songs,
}: RecordsListProps) => {
  const [filterValue, setFilterValue] = useState<string>('')
  const filteredRecords = Record.filterByText({
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
          const { createdOn, id, lastLoadedOn, name } = record

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
        {songs.map(song => {
          const { artist, lang, load, name, video } = song

          return (
            <div key={name + artist} style={{ padding: 10 }}>
              <Cell label="Name" value={name} />
              <Cell title="Artist" value={artist} />
              <Cell bold title="Language" value={lang} />
              {video && (
                <a
                  href={video}
                  style={{ marginRight: 15 }}
                  target="_blank"
                  title={video}
                >
                  Video
                </a>
              )}
              <Button
                onClick={() => {
                  load().then(({ lyrics }) => {
                    onSongLoad(lyrics)
                  })
                }}
              >
                Load
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecordsList
