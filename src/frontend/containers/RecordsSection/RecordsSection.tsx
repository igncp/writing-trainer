import React, { useEffect, useState } from 'react'

import storage from '#/services/storage'

import { Record } from './recordsTypes'
import RecordsWrapper from './RecordsWrapper'

import RecordSave, { RecordToSave } from './screens/RecordSave'
import RecordsList from './screens/RecordsList'

export type RecordsScreen = 'Save' | 'List'

const RECORDS_STORAGE = 'records'

const getMaxRecordId = (records: Record[]) => {
  return Math.max(...records.map(r => r.id)) || 0
}

type RecordsSection = React.FC<{
  initScreen: RecordsScreen
  onRecordsClose(): void
}>

const RecordsSection: RecordsSection = ({ initScreen, onRecordsClose }) => {
  const [currentScreen, setCurrentScreen] = useState<RecordsScreen>(initScreen)
  const [records, setRecords] = useState<Record[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const retrieveRecords = async () => {
    setIsLoading(true)

    const recordsStr = await storage.getValue(RECORDS_STORAGE)

    if (recordsStr) {
      const parsedRecords: Record[] = JSON.parse(recordsStr)

      setRecords(parsedRecords)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    retrieveRecords().catch(() => {})
  }, [])

  const saveRecords = (newRecords: Record[]) => {
    const recordsStr = JSON.stringify(newRecords)
    storage.setValue(RECORDS_STORAGE, recordsStr)
    setRecords(newRecords)
  }

  const handleRecordSave = (newRecord: RecordToSave) => {
    const newRecords = records.concat({
      id: getMaxRecordId(records) + 1,
      name: newRecord.name,
      timestamp: newRecord.timestamp,
    })

    saveRecords(newRecords)
    setCurrentScreen('List')
  }

  const handleRecordRemove = (record: Record) => {
    const newRecords = records.filter(r => r.id !== record.id)

    saveRecords(newRecords)
  }

  if (isLoading) {
    return (
      <RecordsWrapper onRecordsClose={onRecordsClose}>
        Loading...
      </RecordsWrapper>
    )
  }

  if (currentScreen === 'Save') {
    return (
      <RecordsWrapper onRecordsClose={onRecordsClose}>
        <RecordSave
          onRecordSave={handleRecordSave}
          onRecordsList={() => {
            setCurrentScreen('List')
          }}
        />
      </RecordsWrapper>
    )
  }

  if (currentScreen === 'List') {
    return (
      <RecordsWrapper onRecordsClose={onRecordsClose}>
        <RecordsList records={records} onRecordRemove={handleRecordRemove} />
      </RecordsWrapper>
    )
  }

  return null
}

export default RecordsSection
