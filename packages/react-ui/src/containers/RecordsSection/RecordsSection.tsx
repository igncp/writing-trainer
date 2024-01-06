import React, { useEffect, useState } from 'react'
import { LanguageDefinition, Record } from 'writing-trainer-core'

import { T_Services } from '../../typings/mainTypes'

import RecordsWrapper from './RecordsWrapper'
import RecordSave, { RecordToSave } from './screens/RecordSave'
import RecordsList from './screens/RecordsList'

const songs = [
  {
    artist: 'Kay Tse',
    lang: 'cantonese',
    load: () => import('../../languages/cantonese/songs/kay-tse-saan-lam-dou'),
    name: '山林道',
    video: 'https://www.youtube.com/watch?v=W4q4XHhDM-c',
  },
]

export enum RecordsScreen {
  Edit = 'edit',
  List = 'list',
  Save = 'save',
}

const RECORDS_STORAGE = 'records'

const getMaxRecordId = (records: Record[]) => {
  return records.length ? Math.max(...records.map(r => r.id)) : 0
}

const getInitialRecord = ({
  editingRecordId,
  records,
}: {
  editingRecordId: Record['id'] | null
  records: Record[]
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
  onRecordLoad: (r: Record) => void
  onRecordsClose: () => void
  onSongLoad: (s: string[]) => void
  pronunciation: string
  selectedLanguage: LanguageDefinition['id']
  services: T_Services
  text: string
}

const RecordsSection = ({
  initScreen,
  onRecordLoad,
  onRecordsClose,
  onSongLoad,
  pronunciation,
  selectedLanguage,
  services,
  text,
}: IProps) => {
  const [currentScreen, setCurrentScreen] = useState<RecordsScreen>(initScreen)
  const [editingRecordId, setEditingRecordId] = useState<Record['id'] | null>(
    null,
  )
  const [records, setRecords] = useState<Record[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { storage } = services

  const retrieveRecords = async () => {
    setIsLoading(true)

    const recordsStr = await storage.getValue(RECORDS_STORAGE)

    if (recordsStr) {
      const parsedRecords: Record[] = JSON.parse(recordsStr).map(
        (recordObj: ReturnType<Record['toJson']>) => new Record(recordObj),
      )

      setRecords(parsedRecords)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    retrieveRecords().catch(() => {})
  }, [])

  const saveRecords = (newRecords: Record[]) => {
    const recordsStr = JSON.stringify(newRecords.map(record => record.toJson()))
    storage.setValue(RECORDS_STORAGE, recordsStr)
    setRecords(newRecords)
  }

  const handleRecordLoad = (record: Record) => {
    const newRecords = [...records]

    newRecords.find(r => r.id === record.id)!.lastLoadedOn = Date.now()

    saveRecords(newRecords)
    onRecordLoad(record)
  }

  const handleRecordEdit = (record: Record) => {
    setEditingRecordId(record.id)
    setCurrentScreen(RecordsScreen.Edit)
  }

  const handleRecordSave = (newRecord: RecordToSave) => {
    const newRecords = records.concat([
      new Record({
        createdOn: Date.now(),
        id: getMaxRecordId(records) + 1,
        language: selectedLanguage,
        lastLoadedOn: Date.now(),
        link: newRecord.link,
        name: newRecord.name,
        pronunciation,
        text,
      }),
    ])

    saveRecords(newRecords)
    setCurrentScreen(RecordsScreen.List)
  }

  const handleShowRecordsList = () => {
    setEditingRecordId(null)
    setCurrentScreen(RecordsScreen.List)
  }

  const handleRecordEdited = (newRecord: RecordToSave) => {
    const newRecords = records.map(r =>
      r.id === editingRecordId
        ? new Record({
            ...r.toJson(),
            link: newRecord.link,
            name: newRecord.name,
          })
        : r,
    )

    saveRecords(newRecords)
    setEditingRecordId(null)
    setCurrentScreen(RecordsScreen.List)
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

  const commonRecordsSaveProps = {
    onShowRecordsList: handleShowRecordsList,
    services,
  }

  if (currentScreen === RecordsScreen.Save) {
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

  if (currentScreen === RecordsScreen.Edit) {
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
        onSongLoad={onSongLoad}
        records={records}
        songs={songs}
      />
    </RecordsWrapper>
  )
}

export default RecordsSection
