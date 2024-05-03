import React, { useEffect, useRef, useState } from 'react'

import TextInput from '../../../components/TextInput/TextInput'
import 按鈕 from '../../../components/按鈕/按鈕'
import { T_Services } from '../../../typings/mainTypes'

export interface RecordToSave {
  link: string
  name: string
}

type RecordSaveProps = {
  initialRecord: RecordToSave | null
  onRecordSave: (r: RecordToSave) => void
  onShowRecordsList: () => void
  services: T_Services
}

const RecordSave = ({
  initialRecord,
  onRecordSave,
  onShowRecordsList,
  services,
}: RecordSaveProps) => {
  const [recordName, setRecordName] = useState<string>(
    initialRecord ? initialRecord.name : '',
  )
  const [recordLink, setRecordLink] = useState<string>(
    initialRecord ? initialRecord.link : '',
  )
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const linkInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    services
      .getCurrentUrl()
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
        <按鈕 onClick={onShowRecordsList}>List</按鈕>
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
                  linkInputRef.current?.focus()
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
        <按鈕 disabled={isSaveButtonDisabled} onClick={handleRecordSave}>
          儲存
        </按鈕>
      </div>
    </React.Fragment>
  )
}

export default RecordSave
