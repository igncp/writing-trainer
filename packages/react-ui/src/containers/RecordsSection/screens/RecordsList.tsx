import React, { useState } from 'react'
import { Record } from 'writing-trainer-core'

import TextInput from '../../../components/TextInput/TextInput'
import 按鈕 from '../../../components/按鈕/按鈕'

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

type 歌曲類型 = {
  artist: string
  lang: string
  load: () => Promise<{ lyrics: string[] }>
  name: string
  video: string
}

type 條目清單屬性 = {
  onRecordEdit: (r: Record) => void
  onRecordLoad: (r: Record) => void
  onRecordRemove: (r: Record) => void
  onSongLoad: (s: string[]) => void
  records: Record[]
  songs: 歌曲類型[]
}

const RecordsList = ({
  onRecordEdit,
  onRecordLoad,
  onRecordRemove,
  onSongLoad,
  records,
  songs,
}: 條目清單屬性) => {
  const [過濾內容, 更新過濾內容] = useState<string>('')
  const 過濾條目列表 = Record.filterByText({
    filterText: 過濾內容,
    records,
  })

  return (
    <div>
      {records.length > 0 && (
        <div style={{ padding: 10, position: 'relative' }}>
          <TextInput
            autoFocus
            onChange={e => {
              更新過濾內容(e.target.value)
            }}
            onEnterPress={() => {
              if (過濾條目列表.length > 0) {
                onRecordLoad(過濾條目列表[0])
              }
            }}
            placeholder="Filter by name and language"
            style={{ width: '100%' }}
          />
        </div>
      )}
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {過濾條目列表.map(過濾條目 => {
          const { createdOn, id, lastLoadedOn, name } = 過濾條目

          return (
            <div key={id} style={{ padding: 10 }}>
              <Cell label="Name" value={name} />
              <Cell title="Created" value={formatRecordDate(createdOn)} />
              <Cell title="Loaded" value={formatRecordDate(lastLoadedOn)} />
              <Cell bold title="Language" value={過濾條目.language} />
              {過濾條目.link && (
                <a
                  href={過濾條目.link}
                  style={{ marginRight: 15 }}
                  target="_blank"
                  title={過濾條目.link}
                >
                  Website
                </a>
              )}
              <按鈕
                onClick={() => {
                  onRecordLoad(過濾條目)
                }}
              >
                Load
              </按鈕>
              <按鈕
                onClick={() => {
                  onRecordEdit(過濾條目)
                }}
              >
                Edit
              </按鈕>
              <按鈕
                onClick={() => {
                  onRecordRemove(過濾條目)
                }}
              >
                Remove
              </按鈕>
            </div>
          )
        })}
        {songs.map(歌曲 => {
          const { artist, lang, load, name, video } = 歌曲
          const 影片連結網址 = video.startsWith('https://')
            ? video
            : `https://www.youtube.com/watch?v=${video}`

          return (
            <div key={name + artist} style={{ padding: 10 }}>
              <Cell label="Name" value={name} />
              <Cell title="Artist" value={artist} />
              <Cell bold title="Language" value={lang} />
              {video && (
                <a
                  href={影片連結網址}
                  style={{ marginRight: 15 }}
                  target="_blank"
                  title={影片連結網址}
                >
                  影片
                </a>
              )}
              <按鈕
                onClick={() => {
                  load().then(({ lyrics }) => {
                    onSongLoad(lyrics)
                  })
                }}
              >
                載入
              </按鈕>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecordsList
