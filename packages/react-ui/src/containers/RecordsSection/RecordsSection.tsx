import React, { useEffect, useState } from 'react'
import {
  LanguageDefinition,
  records as coreRecords,
} from 'writing-trainer-core'

import { T_Services } from '../../typings/mainTypes'

import RecordsWrapper from './RecordsWrapper'
import RecordSave, { RecordToSave } from './screens/RecordSave'
import RecordsList from './screens/RecordsList'

export type RecordsScreen = 'Edit' | 'List' | 'Save'

type T_Record = coreRecords.T_Record

const RECORDS_STORAGE = 'records'

const getMaxRecordId = (records: T_Record[]) => {
  return records.length ? Math.max(...records.map(r => r.id)) : 0
}

const getInitialRecord = ({
  records,
  editingRecordId,
}: {
  editingRecordId: T_Record['id'] | null
  records: T_Record[]
}) => {
  if (editingRecordId === null) {
    return null
  }

  const record = records.find(r => r.id === editingRecordId)

  if (!record) {
    return null
  }

  return {
    link: record.link,
    name: record.name,
  }
}

type IProps = {
  initScreen: RecordsScreen
  onRecordLoad: (r: T_Record) => void
  onRecordsClose: () => void
  pronunciation: string
  selectedLanguage: LanguageDefinition['id']
  services: T_Services
  text: string
}

const RecordsSection = ({
  initScreen,
  onRecordLoad,
  onRecordsClose,
  pronunciation,
  selectedLanguage,
  services,
  text,
}: IProps) => {
  const [currentScreen, setCurrentScreen] = useState<RecordsScreen>(initScreen)
  const [editingRecordId, setEditingRecordId] = useState<T_Record['id'] | null>(
    null,
  )
  const [records, setRecords] = useState<T_Record[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { storage } = services

  const retrieveRecords = async () => {
    setIsLoading(true)

    const recordsStr = await storage.getValue(RECORDS_STORAGE)

    if (recordsStr) {
      const parsedRecords: T_Record[] = JSON.parse(recordsStr)

      setRecords(parsedRecords)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    retrieveRecords().catch(() => {})
  }, [])

  const saveRecords = (newRecords: T_Record[]) => {
    const recordsStr = JSON.stringify(newRecords)
    storage.setValue(RECORDS_STORAGE, recordsStr)
    setRecords(newRecords)
  }

  const handleRecordLoad = (record: T_Record) => {
    const newRecords = [...records]

    newRecords.find(r => r.id === record.id)!.lastLoadedOn = Date.now()

    saveRecords(newRecords)
    onRecordLoad(record)
  }

  const handleRecordEdit = (record: T_Record) => {
    setEditingRecordId(record.id)
    setCurrentScreen('Edit')
  }

  const handleRecordSave = (newRecord: RecordToSave) => {
    const newRecords = records.concat({
      createdOn: Date.now(),
      id: getMaxRecordId(records) + 1,
      language: selectedLanguage,
      lastLoadedOn: Date.now(),
      link: newRecord.link,
      name: newRecord.name,
      pronunciation,
      text,
    })

    saveRecords(newRecords)
    setCurrentScreen('List')
  }

  const handleShowRecordsList = () => {
    setEditingRecordId(null)
    setCurrentScreen('List')
  }

  const handleRecordEdited = (newRecord: RecordToSave) => {
    const newRecords = records.map(r =>
      r.id === editingRecordId
        ? {
            ...r,
            link: newRecord.link,
            name: newRecord.name,
          }
        : r,
    )

    saveRecords(newRecords)
    setEditingRecordId(null)
    setCurrentScreen('List')
  }

  const handleRecordRemove = (record: T_Record) => {
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

  const commonRecordsSaveProps = {
    onShowRecordsList: handleShowRecordsList,
    services,
  }

  if (currentScreen === 'Save') {
    return (
      <RecordsWrapper onRecordsClose={onRecordsClose}>
        <RecordSave
          initialRecord={null}
          onRecordSave={handleRecordSave}
          {...commonRecordsSaveProps}
        />
      </RecordsWrapper>
    )
  }

  if (currentScreen === 'Edit') {
    return (
      <RecordsWrapper onRecordsClose={onRecordsClose}>
        <RecordSave
          initialRecord={getInitialRecord({ editingRecordId, records })}
          onRecordSave={handleRecordEdited}
          {...commonRecordsSaveProps}
        />
      </RecordsWrapper>
    )
  }

  return (
    <RecordsWrapper onRecordsClose={onRecordsClose}>
      <RecordsList
        onRecordEdit={handleRecordEdit}
        onRecordLoad={handleRecordLoad}
        onRecordRemove={handleRecordRemove}
        records={records}
      />
    </RecordsWrapper>
  )
}

export default RecordsSection
