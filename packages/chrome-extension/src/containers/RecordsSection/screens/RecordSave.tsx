import React, { useEffect, useRef, useState } from 'react'

import Button from '#/components/Button/Button'
import TextInput from '#/components/TextInput/TextInput'
import getCurrentUrl from '#/services/getCurrentUrl'

export interface RecordToSave {
  name: string
  link: string
}

type RecordSave = React.FC<{
  onRecordSave(r: RecordToSave): void
}>

const RecordSave: RecordSave = ({ onRecordSave }) => {
  const [recordName, setRecordName] = useState<string>('')
  const [recordLink, setRecordLink] = useState<string>('')
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
                if (recordName) {
                  linkInputRef.current.focus()
                }
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
        <Button onClick={handleRecordSave} disabled={isSaveButtonDisabled}>
          Save
        </Button>
      </div>
    </React.Fragment>
  )
}

export default RecordSave
