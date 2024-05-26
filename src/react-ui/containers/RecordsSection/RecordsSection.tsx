import { LanguageDefinition, Record } from '#/core'
import { TextGql } from '#/react-ui/graphql/graphql'
import { backendClient } from '#/react-ui/lib/backendClient'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { songs as cantoneseSongs } from '../../languages/cantonese/songs'
import { songs as mandarinSongs } from '../../languages/mandarin/songs'
import { T_Services } from '../../typings/mainTypes'
import { useMainContext } from '../main-context'

import RecordsWrapper from './RecordsWrapper'
import RecordSave, { RecordToSave } from './screens/RecordSave'
import RecordsList from './screens/RecordsList'

export enum RecordsScreen {
  Edit = 'edit',
  List = 'list',
  Save = 'save',
}

const RECORDS_STORAGE = 'records'

const getMaxRecordId = (records: Record[]) =>
  records.length ? Math.max(...records.map(r => Number(r.id) || 0)) : 0

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

// @TODO: Remove local/remote records and use a offline syncing librar
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
  const mainContext = useMainContext()

  const { storage } = services

  const retrieveRecords = async () => {
    setIsLoading(true)

    const [dbTexts, recordsStr] = await Promise.all([
      backendClient.getUserTexts().catch(() => [] as TextGql[]),
      storage.getValue(RECORDS_STORAGE),
    ])

    const recordsLocal = (() => {
      if (recordsStr) {
        const parsedRecords: Record[] = JSON.parse(recordsStr).map(
          (recordObj: ReturnType<Record['toJson']>) => new Record(recordObj),
        )

        return parsedRecords
      }

      return []
    })()

    const allRecords = dbTexts
      .map(
        dbText =>
          new Record({
            createdOn: Date.now(),
            id: dbText.id,
            isRemote: true,
            language: dbText.language,
            lastLoadedOn: Date.now(),
            link: '',
            name: decodeURIComponent(dbText.title ?? ''),
            pronunciation,
            text: decodeURIComponent(dbText.body),
          }),
      )
      .concat(recordsLocal)

    setRecords(allRecords)

    setIsLoading(false)
  }

  useEffect(() => {
    retrieveRecords().catch(() => {})
  }, [])

  const saveRecord = (newRecord: Record) => {
    let newRecords = [...records]
    const existingRecordIndex = newRecords.findIndex(r => r.id === newRecord.id)

    if (existingRecordIndex !== -1) {
      newRecords[existingRecordIndex] = newRecord
    } else {
      newRecords.unshift(newRecord)
    }

    newRecords = newRecords.filter(r => r.text.trim())

    if (mainContext.state.isLoggedIn) {
      newRecord.isRemote = true

      setIsLoading(true)

      backendClient
        .saveText({
          body: newRecord.text,
          id: newRecord.id,
          language: newRecord.language,
          title: newRecord.name,
          url: newRecord.link,
        })
        .then(({ id }) => {
          newRecord.id = id

          setRecords(newRecords)
        })
        .catch(() => {
          toast.error('保存記錄失敗')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (newRecord.isRemote) {
      toast.error('您需要登入才能保存遠端記錄')
    } else {
      newRecord.id = (getMaxRecordId(records) + 1).toString()
    }

    const recordsStr = JSON.stringify(
      newRecords.filter(r => !r.isRemote).map(record => record.toJson()),
    )
    storage.setValue(RECORDS_STORAGE, recordsStr)
    setRecords(newRecords)
  }

  const handleRecordLoad = (record: Record) => {
    if (isLoading) return

    record.lastLoadedOn = Date.now()
    saveRecord(record)
    onRecordLoad(record)
  }

  const handleRecordEdit = (record: Record) => {
    if (isLoading) return

    setEditingRecordId(record.id)
    setCurrentScreen(RecordsScreen.Edit)
  }

  const handleRecordSave = (newRecordSave: RecordToSave) => {
    if (isLoading) return

    const newRecord = new Record({
      createdOn: Date.now(),
      id: '',
      isRemote: false,
      language: selectedLanguage,
      lastLoadedOn: Date.now(),
      link: newRecordSave.link,
      name: newRecordSave.name,
      pronunciation,
      text,
    })

    saveRecord(newRecord)
    setCurrentScreen(RecordsScreen.List)
  }

  const handleShowRecordsList = () => {
    if (isLoading) return

    setEditingRecordId(null)
    setCurrentScreen(RecordsScreen.List)
  }

  const handleRecordEdited = (newRecordSave: RecordToSave) => {
    const existingRecord = records.find(r => r.id === editingRecordId)

    if (!existingRecord) return
    const newRecord = new Record({
      ...existingRecord,
      link: newRecordSave.link,
      name: newRecordSave.name,
    })

    saveRecord(newRecord)
    setEditingRecordId(null)
    setCurrentScreen(RecordsScreen.List)
  }

  const handleRecordRemove = (record: Record) => {
    record.text = ''

    saveRecord(record)
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
          disabled={isLoading}
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
        disabled={isLoading}
        onRecordEdit={handleRecordEdit}
        onRecordLoad={handleRecordLoad}
        onRecordRemove={handleRecordRemove}
        onSongLoad={onSongLoad}
        records={records}
        songs={cantoneseSongs.concat(mandarinSongs)}
      />
    </RecordsWrapper>
  )
}

export default RecordsSection
