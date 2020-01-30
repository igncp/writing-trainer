import React, { useEffect, useRef, useState } from 'react'

import Button from '#/components/Button/Button'
import TextInput from '#/components/TextInput/TextInput'
import getCurrentUrl from '#/services/getCurrentUrl'

export interface RecordToSave {
  name: string
  link: string
}

type RecordSave = React.FC<{
  initialRecord: RecordToSave | null
  onRecordSave(r: RecordToSave): void
  onShowRecordsList(): void
}>

const RecordSave: RecordSave = ({
  onRecordSave,
  initialRecord,
  onShowRecordsList,
}) => {
  const [recordName, setRecordName] = useState<string>(
    initialRecord ? initialRecord.name : ''
  )
  const [recordLink, setRecordLink] = useState<string>(
    initialRecord ? initialRecord.link : ''
  )
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const linkInputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    getCurrentUrl()
      .then(newCurrentUrl => {
        setCurrentUrl(newCurrentUrl)
        setRecordLink(newCurrentUrl)
      })
      .catch((e: Error) => {
        console.log(e)
      })
  }, [])

  if (!currentUrl) {
    return null
  }

  const isSaveButtonDisabled = !recordName

  const handleRecordSave = () => {
    if (!isSaveButtonDisabled) {
      onRecordSave({
        link: recordLink.trim(),
        name: recordName,
      })
    }
  }

  return (
    <React.Fragment>
      <div>
        <Button onClick={onShowRecordsList}>List</Button>
      </div>
      <div>
        <div style={{ padding: 10 }}>
          Name:{' '}
          <span style={{ marginLeft: 10 }}>
            <TextInput
              autoFocus
              onChange={e => {
                setRecordName(e.target.value)
              }}
              onEnterPress={() => {
                if (recordName) {
                  linkInputRef.current.focus()
                }
              }}
              value={recordName}
            />
          </span>
        </div>
        <div style={{ padding: 10 }}>
          Link:{' '}
          <span style={{ marginLeft: 10 }}>
            <TextInput
              inputRef={linkInputRef}
              onChange={e => {
                setRecordLink(e.target.value)
              }}
              onEnterPress={handleRecordSave}
              value={recordLink}
            />
          </span>
        </div>
      </div>
      <div>
        <Button disabled={isSaveButtonDisabled} onClick={handleRecordSave}>
          Save
        </Button>
      </div>
    </React.Fragment>
  )
}

export default RecordSave
