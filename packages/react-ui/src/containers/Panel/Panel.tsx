import React, { useEffect, useState } from 'react'
import {
  LanguageDefinition,
  LanguageManager,
  Record,
} from 'writing-trainer-core'

import Button from '../../components/Button/Button'
import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage'
import TextArea from '../../components/TextArea/TextArea'
import { LanguageUIManager } from '../../languages/languageUIManager'
import {
  T_LangOpts,
  T_getCurrentCharObjFromPractice,
} from '../../languages/types'
import { T_Services } from '../../typings/mainTypes'
import RecordsSection, { RecordsScreen } from '../RecordsSection/RecordsSection'

const STORAGE_LANGUAGE_KEY = 'selectedLanguage'

const createInputSetterFn =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (setValue: any) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

const createToggleFn = (val: boolean, fn: (i: boolean) => void) => () => {
  fn(!val)
}

const SHORTCUT_EDITING = 'control+control+shift'
const SHORTCUT_PRONUNCIATION = 'shift+shift+control'

const PRACTICE_TEXT_PLACEHOLDER = `Practice Text
Toggle Editing: ${SHORTCUT_EDITING}
Toggle Pronunciation: ${SHORTCUT_PRONUNCIATION}`

type Props = {
  UI?: {
    noHideButton?: boolean
  }
  languageManager: LanguageManager
  languageUIManager: LanguageUIManager
  onHideRequest?: () => void
  services: T_Services
  text: string
  _stories?: {
    defaultLanguage?: LanguageDefinition['id']
    defaultPractice?: string
    defaultPronunciation?: string
    langOpts?: T_LangOpts
  }
}

const getLanguageDefinitions = (languageManager: LanguageManager) => {
  return languageManager.getAvailableLanguages().map(langId => {
    const languageHandler = languageManager.getLanguageHandler(langId)

    return languageHandler!.language
  })
}

const Panel = ({
  UI,
  _stories = {},
  languageManager,
  languageUIManager,
  onHideRequest,
  services,
  text,
}: Props) => {
  const initialLanguageId = languageUIManager.getDefaultLanguage()
  const [showingRecordsInitScreen, setShowingRecordsInitScreen] = useState<
    RecordsScreen | ''
  >('')
  const [currentRecord, setCurrentRecord] = useState<Record['id'] | null>(null)
  const [originalTextValue, setOriginalText] = useState<string>(text)
  const [pronunciationValue, setPronunciation] = useState<string>(
    _stories.defaultPronunciation ?? '',
  )
  const [specialCharsValue, setSpecialChars] = useState<string>('')
  const [writingValue, setWriting] = useState<string>('')
  const [practiceValue, setPractice] = useState<string>(
    _stories.defaultPractice ?? '',
  )
  const [isShowingPronunciation, setShowingPronunciation] = useState(true)
  const [isShowingEdition, setShowingEdition] = useState<boolean>(true)
  const [doesPracticeHaveError, setPracticeHasError] = useState<boolean>(false)
  const [lastThreeKeys, setLastThreeKeys] = useState<string[]>([])
  const [languageOptions, setLanguageOptions] = useState<T_LangOpts>({})
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageDefinition['id']>(initialLanguageId)
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [currentDisplayCharIdx, setCurrentDisplayCharIdx] = useState<number>(0)

  const uiHandler = languageUIManager.getUIHandler()
  const langHandler = languageManager.getCurrentLanguageHandler()

  const tryToUpdatePronunciation = () => {}

  const { storage } = services

  const handleOriginalTextUpdate = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const val = e.target.value

    if (val) {
      tryToUpdatePronunciation()
    }

    setOriginalText(val)
  }

  useEffect(() => {
    if (originalTextValue) {
      tryToUpdatePronunciation()
    }
  }, [selectedLanguage])

  const updateLanguage = (lang: LanguageDefinition['id']) => {
    languageManager.setCurrentLanguageHandler(lang)
    setSelectedLanguage(lang)
  }

  useEffect(() => {
    if (!_stories.defaultLanguage) {
      return
    }

    updateLanguage(_stories.defaultLanguage)
  }, [_stories.defaultLanguage])

  const updateLanguageWithStorage = async () => {
    const storageSelectedLanguage = await storage.getValue(STORAGE_LANGUAGE_KEY)

    if (
      storageSelectedLanguage &&
      storageSelectedLanguage !== selectedLanguage &&
      !_stories.defaultLanguage
    ) {
      updateLanguage(storageSelectedLanguage)
    }
    setHasLoadedStorage(true)
  }

  useEffect(() => {
    updateLanguageWithStorage().catch(() => {})
  }, [])

  const SPECIAL_CHARS = langHandler!.getSpecialChars()
  const langOpts = _stories.langOpts ?? uiHandler.getLangOpts()
  const langOptsObj = {
    langOpts: {
      pronunciationInput: pronunciationValue,
      ...((langOpts as unknown as object | undefined) ?? {}),
    },
  }

  const charsObjs = langHandler!.convertToCharsObjs({
    ...langOptsObj,
    charsToRemove: specialCharsValue.split('').concat(SPECIAL_CHARS),
    text: originalTextValue,
  })

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice = (
    practiceText = practiceValue,
  ) => {
    const practiceCharsObjs = langHandler!.convertToCharsObjs({
      ...langOptsObj,
      charsToRemove: specialCharsValue.split('').concat(SPECIAL_CHARS),
      text: practiceText,
    })

    return langHandler!.getCurrentCharObj({
      originalCharsObjs: charsObjs,
      practiceCharsObjs,
    })
  }

  useEffect(() => {
    const practiceCharObj = getCurrentCharObjFromPractice()

    if (practiceCharObj?.ch) {
      setCurrentDisplayCharIdx(practiceCharObj.index)
    }

    return () => {}
  }, [practiceValue, pronunciationValue])

  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      const value = e.key
      const newArr = lastThreeKeys.slice(-2).concat([value])
      const currentResult = newArr.join('+').toLowerCase()

      if (currentResult === SHORTCUT_PRONUNCIATION) {
        setShowingPronunciation(!isShowingPronunciation)
      } else if (currentResult === SHORTCUT_EDITING) {
        setShowingEdition(!isShowingEdition)
      }

      setLastThreeKeys(newArr)
    }

    document.addEventListener('keydown', handleShortcuts)

    return () => {
      document.removeEventListener('keydown', handleShortcuts)
    }
  }, [lastThreeKeys, isShowingEdition, isShowingPronunciation])

  const clearValues = () => {
    // eslint-disable-next-line padding-line-between-statements,@typescript-eslint/no-extra-semi
    ;[
      setOriginalText,
      setPronunciation,
      setSpecialChars,
      setWriting,
      setPractice,
    ].forEach(fn => {
      fn('')
    })
    setShowingPronunciation(true)
    setShowingEdition(true)
    setCurrentRecord(null)
  }

  const handleLanguageChange = (newSelectedLanguage: string) => {
    storage.setValue(STORAGE_LANGUAGE_KEY, newSelectedLanguage)
    updateLanguage(newSelectedLanguage)
  }

  const handleWritingKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    // special key
    if (e.key === '`') {
      e.preventDefault()
      setWriting('')
      setPracticeHasError(false)

      return
    }

    if (e.key === 'Enter') {
      setPractice(`${practiceValue}\n`)
    }

    uiHandler.handleWritingKeyDown({
      charsObjs,
      getCurrentCharObjFromPractice,
      keyEvent: e,
      languageOptions,
      originalTextValue,
      practiceValue,
      setCurrentDisplayCharIdx,
      setPractice,
      setPracticeHasError,
      setWriting,
      specialCharsValue,
      writingValue,
    })
  }

  const handleLanguageOptionsChange = (opts: T_LangOpts) => {
    setLanguageOptions(opts)
  }

  const handleWritingAreaClick = () => {
    setLastThreeKeys([])
  }

  const LinksBlock = uiHandler.getLinksBlock()
  const OptionsBlock = uiHandler.getOptionsBlock()
  const handleDisplayedCharClick = uiHandler.getDisplayedCharHandler()

  const saveRecord = () => {
    setShowingRecordsInitScreen(RecordsScreen.Save)
  }

  const listRecords = () => {
    setShowingRecordsInitScreen(RecordsScreen.List)
  }

  if (!hasLoadedStorage) {
    return null
  }

  if (showingRecordsInitScreen) {
    return (
      <RecordsSection
        initScreen={showingRecordsInitScreen}
        onRecordLoad={(record: Record) => {
          clearValues()

          if (record.language !== selectedLanguage) {
            handleLanguageChange(record.language)
          }

          setShowingRecordsInitScreen('')
          setShowingEdition(false)
          setShowingPronunciation(false)
          setOriginalText(record.text)
          setCurrentRecord(record.id)
          setPronunciation(record.pronunciation)
        }}
        onRecordsClose={() => {
          setShowingRecordsInitScreen('')
        }}
        pronunciation={pronunciationValue}
        selectedLanguage={selectedLanguage}
        services={services}
        text={originalTextValue}
      />
    )
  }

  return (
    <>
      <Button onClick={clearValues}>Clear</Button>
      <Button onClick={listRecords}>Records</Button>
      <Button onClick={createToggleFn(isShowingEdition, setShowingEdition)}>
        Toggle Edition
      </Button>
      <Button
        onClick={createToggleFn(
          isShowingPronunciation,
          setShowingPronunciation,
        )}
      >
        Toggle Pronunciation
      </Button>
      <ChooseLanguage
        languages={getLanguageDefinitions(languageManager)}
        onOptionsChange={handleLanguageChange}
        selectedLanguage={selectedLanguage}
      />
      <Button onClick={saveRecord}>
        {currentRecord === null ? 'Save' : 'Update'}
      </Button>
      {currentRecord !== null && (
        <Button
          onClick={() => {
            setCurrentRecord(null)
          }}
        >
          Close Record
        </Button>
      )}
      <Button
        onClick={onHideRequest ?? undefined}
        style={{
          display: UI?.noHideButton ? 'none' : 'block',
          float: 'right',
        }}
      >
        Hide
      </Button>
      <div style={{ padding: '0 0 20px' }}>
        {isShowingEdition && (
          <div>
            <TextArea
              onChange={handleOriginalTextUpdate}
              placeholder="Original text"
              rows={3}
              value={originalTextValue}
            />
            <TextArea
              onChange={createInputSetterFn(setPronunciation)}
              placeholder="Pronunciation"
              rows={2}
              value={pronunciationValue}
            />
            <TextArea
              onChange={createInputSetterFn(setSpecialChars)}
              placeholder="Special characters"
              rows={1}
              value={specialCharsValue}
            />
            <OptionsBlock
              languageOptions={languageOptions}
              onOptionsChange={handleLanguageOptionsChange}
            />
          </div>
        )}{' '}
        <div>
          <div style={{ marginBottom: 10, marginTop: 5 }}>
            <CharactersDisplay
              charsObjs={charsObjs}
              focusedIndex={currentDisplayCharIdx}
              onCharClick={handleDisplayedCharClick}
              shouldHaveDifferentWidths={!uiHandler.shouldAllCharsHaveSameWidth}
              shouldHidePronunciation={!isShowingPronunciation}
            />
          </div>
          <TextArea
            autoFocus
            onChange={createInputSetterFn(setWriting)}
            onClick={handleWritingAreaClick}
            onKeyDown={handleWritingKeyDown}
            placeholder={practiceValue ? '' : 'Writing area'}
            rows={1}
            value={writingValue}
            withoutCursor
          />
          <TextArea
            autoScroll
            onChange={createInputSetterFn(setPractice)}
            placeholder={PRACTICE_TEXT_PLACEHOLDER}
            rows={3}
            style={{
              border: `1px solid ${doesPracticeHaveError ? 'red' : 'white'}`,
              fontSize: 46,
              lineHeight: '46px',
            }}
            value={practiceValue}
          />
        </div>
      </div>
      <LinksBlock text={originalTextValue} />
    </>
  )
}

export default Panel
