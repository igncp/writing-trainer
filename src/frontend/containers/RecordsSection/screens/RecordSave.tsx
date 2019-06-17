import React, { useState } from 'react'

import Button from '#/components/Button/Button'
import TextInput from '#/components/TextInput/TextInput'

export interface RecordToSave {
  name: string
  timestamp: number
}

type RecordSave = React.FC<{
  onRecordsList(): void
  onRecordSave(r: RecordToSave): void
}>

const RecordSave: RecordSave = ({ onRecordsList, onRecordSave }) => {
  const [recordName, setRecordName] = useState('')

  const handleRecordSave = () => {
    if (recordName) {
      onRecordSave({
        name: recordName,
        timestamp: Date.now(),
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
              onEnterPress={handleRecordSave}
            />
          </span>
        </div>
      </div>
      <div>
        <Button onClick={handleRecordSave}>Save</Button>
      </div>
      <div>
        <Button onClick={onRecordsList}>Load</Button>
      </div>
    </div>
  )
}

export default RecordSave
