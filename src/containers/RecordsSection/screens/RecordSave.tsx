import React, { useRef, useState } from 'react'

import Button from '#/components/Button/Button'
import TextInput from '#/components/TextInput/TextInput'

export interface RecordToSave {
  name: string
  link: string
}

type RecordSave = React.FC<{
  onRecordSave(r: RecordToSave): void
}>

const RecordSave: RecordSave = ({ onRecordSave }) => {
  const [recordName, setRecordName] = useState('')
  const [recordLink, setRecordLink] = useState('')
  const linkInputRef = useRef<HTMLInputElement>()

  const handleRecordSave = () => {
    if (recordName) {
      onRecordSave({
        link: recordLink.trim(),
        name: recordName,
      })
    }
  }

  return (
    <div>
      <div>
        <div style={{ padding: 10 }}>
          Name:{' '}
          <span style={{ marginLeft: 10 }}>
            <TextInput
              autoFocus
              value={recordName}
              onChange={e => {
                setRecordName(e.target.value)
              }}
              onEnterPress={() => {
                linkInputRef.current.focus()
              }}
            />
          </span>
        </div>
        <div style={{ padding: 10 }}>
          Link:{' '}
          <span style={{ marginLeft: 10 }}>
            <TextInput
              inputRef={linkInputRef}
              value={recordLink}
              onChange={e => {
                setRecordLink(e.target.value)
              }}
              onEnterPress={handleRecordSave}
            />
          </span>
        </div>
      </div>
      <div>
        <Button onClick={handleRecordSave}>Save</Button>
      </div>
    </div>
  )
}

export default RecordSave
