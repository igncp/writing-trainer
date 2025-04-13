import { LanguageDefinition, Record as CoreRecord } from '#/core'
import { TextGql } from '#/react-ui/graphql/graphql'
import { backendClient, SongItem } from '#/react-ui/lib/backendClient'
import { Paths } from '#/react-ui/lib/paths'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

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

export const recordsModeToPath: Record<RecordsScreen, string> = {
  [RecordsScreen.Edit]: Paths.records.edit,
  [RecordsScreen.List]: Paths.records.list,
  [RecordsScreen.Save]: Paths.records.save,
}

const RECORDS_STORAGE = 'records'

const getMaxRecordId = (records: CoreRecord[]) =>
  records.length ? Math.max(...records.map(r => Number(r.id) || 0)) : 0

const getInitialRecord = ({
  editingRecordId,
  records,
}: {
  editingRecordId: CoreRecord['id'] | null
  records: CoreRecord[]
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
  language: string
  onPronunciationLoad: (p: string) => void
  onRecordLoad: (r: CoreRecord) => void
  onRecordsClose: () => void
  onSongLoad: (s: string[]) => void
  pronunciation: string
  selectedLanguage: LanguageDefinition['id']
  services: T_Services
  text: string
}

// @TODO: Remove local/remote records and use a offline syncing library
const RecordsSection = ({
  initScreen,
  language,
  onPronunciationLoad,
  onRecordLoad,
  onRecordsClose,
  onSongLoad,
  pronunciation,
  selectedLanguage,
  services,
  text,
}: IProps) => {
  const [currentScreen, setCurrentScreen] = useState<RecordsScreen>(initScreen)

  const [editingRecordId, setEditingRecordId] = useState<
    CoreRecord['id'] | null
  >(null)

  const [records, setRecords] = useState<CoreRecord[]>([])

  const [songs, setSongs] = useState<{ list: SongItem[]; total: number }>({
    list: [],
    total: 0,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [songsFilter, setSongsFilter] = useState<string>('')

  const songsDebounceRef = useRef<null | number>(null)
  const mainContext = useMainContext()

  const { isBackendActive } = mainContext.state

  const { storage } = services

  const retrieveRecords = useCallback(async () => {
    setIsLoading(true)

    const [dbTexts, recordsStr] = await Promise.all([
      backendClient.getUserTexts().catch(() => [] as TextGql[]),
      storage.getValue(RECORDS_STORAGE),
    ])

    const recordsLocal = (() => {
      if (recordsStr) {
        const parsedRecords: CoreRecord[] = JSON.parse(recordsStr).map(
          (recordObj: ReturnType<CoreRecord['toJson']>) =>
            new CoreRecord(recordObj),
        )

        return parsedRecords
      }

      return []
    })()

    const allRecords = dbTexts
      .map(
        dbText =>
          new CoreRecord({
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
  }, [pronunciation, storage])

  const retrieveSongs = useCallback(async () => {
    if (!isBackendActive) return

    if (songsDebounceRef.current) {
      clearTimeout(songsDebounceRef.current)
    }

    songsDebounceRef.current = window.setTimeout(async () => {
      const timeoutVal = songsDebounceRef.current

      setIsLoading(true)

      const newSongs = await backendClient
        .getSongs(language, songsFilter, 100, 0)
        .catch(() => ({ list: [], total: 0 }))

      if (timeoutVal !== songsDebounceRef.current) {
        return
      }

      setSongs(newSongs)

      setIsLoading(false)
      songsDebounceRef.current = null
    }, 1000)
  }, [language, songsFilter, isBackendActive])

  useEffect(() => {
    retrieveRecords().catch(() => {})
  }, [retrieveRecords])

  useEffect(() => {
    retrieveSongs().catch(() => {})
  }, [retrieveSongs])

  const saveRecord = (newRecord: CoreRecord) => {
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

  const handleRecordLoad = (record: CoreRecord) => {
    if (isLoading) return

    record.lastLoadedOn = Date.now()
    saveRecord(record)
    onRecordLoad(record)
  }

  const handleRecordEdit = (record: CoreRecord) => {
    if (isLoading) return

    setEditingRecordId(record.id)
    setCurrentScreen(RecordsScreen.Edit)
  }

  const handleRecordSave = (newRecordSave: RecordToSave) => {
    if (isLoading) return

    const newRecord = new CoreRecord({
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

    const newRecord = new CoreRecord({
      ...existingRecord,
      link: newRecordSave.link,
      name: newRecordSave.name,
    })

    saveRecord(newRecord)
    setEditingRecordId(null)
    setCurrentScreen(RecordsScreen.List)
  }

  const handleRecordRemove = (record: CoreRecord) => {
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
        onPronunciationLoad={onPronunciationLoad}
        onRecordEdit={handleRecordEdit}
        onRecordLoad={handleRecordLoad}
        onRecordRemove={handleRecordRemove}
        onSongLoad={onSongLoad}
        records={records}
        setSongsFilter={setSongsFilter}
        songs={songs}
        songsFilter={songsFilter}
      />
    </RecordsWrapper>
  )
}

export default RecordsSection
