import React, { useEffect, useState } from 'react'

import Button from '#/components/Button/Button'
import CharactersDisplay from '#/components/CharactersDisplay/CharactersDisplay'
import ChooseLanguage from '#/components/ChooseLanguage/ChooseLanguage'
import PanelBase from '#/components/PanelBase/PanelBase'
import TextArea from '#/components/TextArea/TextArea'
import RecordsSection, {
  RecordsScreen,
} from '#/containers/RecordsSection/RecordsSection'
import { Record } from '#/containers/RecordsSection/recordsTypes'
import languageManager from '#/languages/languageManager'
import {
  TLanguageDefinition,
  TLanguageId,
  TLanguageOptions,
} from '#/languages/types'
import storage from '#/services/storage'

import { getCurrentCharObj } from './panelHelpers'

const STORAGE_LANGUAGE_KEY = 'selectedLanguage'

const createInputSetterFn = (setValue: Function) => (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => {
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

type TPanel = React.FC<{
  onHideRequest(): void
  pronunciation?: string
  _stories?: {
    defaultPractice?: string
    defaultLanguage?: TLanguageId
  }
  text: string
}>

const initialLanguageId = languageManager.getDefaultLanguage()

const Panel: TPanel = ({ onHideRequest, text, pronunciation, _stories }) => {
  const [showingRecordsInitScreen, setShowingRecordsInitScreen] = useState<
    RecordsScreen | ''
  >('')
  const [originalTextValue, setOriginalText] = useState<string>(text)
  const [pronunciationValue, setPronunciation] = useState<string>('')
  const [specialCharsValue, setSpecialChars] = useState<string>('')
  const [writingValue, setWriting] = useState<string>('')
  const [practiceValue, setPractice] = useState<string>(
    _stories.defaultPractice || ''
  )
  const [isShowingPronunciation, setShowingPronunciation] = useState<boolean>(
    true
  )
  const [isShowingEdition, setShowingEdition] = useState<boolean>(true)
  const [doesPracticeHaveError, setPracticeHasError] = useState<boolean>(false)
  const [lastThreeKeys, setLastThreeKeys] = useState<string[]>([])
  const [languageOptions, setLanguageOptions] = useState<TLanguageOptions>({})
  const [selectedLanguage, setSelectedLanguage] = useState<
    TLanguageDefinition['id']
  >(_stories.defaultLanguage ? _stories.defaultLanguage : initialLanguageId)
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [currentDisplayCharIdx, setCurrentDisplayCharIdx] = useState<number>(0)

  const tryToUpdatePronunciation = (originalTextNewValue: string) => {
    const maybePronunciation = languageManager.getPronunciationOfText(
      selectedLanguage,
      {
        charsToRemove: specialCharsValue,
        text: originalTextNewValue,
      }
    )
    if (maybePronunciation) {
      setPronunciation(maybePronunciation)
      setShowingPronunciation(false)
      setShowingEdition(false)
    }
  }

  const handleOriginalTextUpdate = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const val = e.target.value

    if (val) {
      tryToUpdatePronunciation(val)
    }

    setOriginalText(val)
  }

  useEffect(() => {
    if (originalTextValue) {
      tryToUpdatePronunciation(originalTextValue)
    }
  }, [selectedLanguage])

  const updateLanguageWithStorage = async () => {
    const storageSelectedLanguage = await storage.getValue(STORAGE_LANGUAGE_KEY)
    if (
      storageSelectedLanguage &&
      storageSelectedLanguage !== selectedLanguage &&
      !_stories.defaultLanguage
    ) {
      setSelectedLanguage(storageSelectedLanguage)
    }
    setHasLoadedStorage(true)
  }

  useEffect(() => {
    updateLanguageWithStorage().catch(() => {})
  }, [])

  const SPECIAL_CHARS = languageManager.getSpecialChars(selectedLanguage)
  const convertToCharsObjs = languageManager.getCharsObjsConverter()

  const charsObjs = convertToCharsObjs({
    charsToRemove: specialCharsValue + SPECIAL_CHARS,
    pronunciation: pronunciationValue,
    text: originalTextValue,
  })

  const getCurrentCharObjFromPractice = () => {
    const practiceCharsObjs = convertToCharsObjs({
      charsToRemove: specialCharsValue + SPECIAL_CHARS,
      pronunciation: pronunciationValue,
      text: practiceValue,
    })

    return getCurrentCharObj({
      originalCharsObjs: charsObjs,
      practiceCharsObjs,
    })
  }

  useEffect(() => {
    const currentCharObj = getCurrentCharObjFromPractice()

    if (!currentCharObj) {
      return () => {}
    }

    setCurrentDisplayCharIdx(currentCharObj.index)

    return () => {}
  }, [practiceValue])

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
    // tslint:disable-next-line semicolon
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
  }

  const handleLanguageChange = (newSelectedLanguage: string) => {
    storage.setValue(STORAGE_LANGUAGE_KEY, newSelectedLanguage)
    setSelectedLanguage(newSelectedLanguage)
  }

  const handleWritingKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Backspace' && writingValue.length === 0) {
      setPractice(practiceValue.slice(0, practiceValue.length - 1))
    }

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

    const currentCharObj = getCurrentCharObjFromPractice()

    if (!currentCharObj) {
      console.warn('missing char obj')
      setPracticeHasError(false)

      return
    }

    setCurrentDisplayCharIdx(currentCharObj.index)

    languageManager.handleWritingKeyDown({
      charsObjs,
      currentCharObj,
      keyEvent: e,
      languageOptions,
      originalTextValue,
      practiceValue,
      setPractice,
      setPracticeHasError,
      setWriting,
      specialCharsValue,
      writingValue,
    })
  }

  const handleLanguageOptionsChange = (opts: TLanguageOptions) => {
    setLanguageOptions(opts)
  }

  const handleWritingAreaClick = () => {
    setLastThreeKeys([])
  }

  const LinksBlock = languageManager.getLinksBlock(selectedLanguage)
  const OptionsBlock = languageManager.getOptionsBlock(selectedLanguage)
  const handleDisplayedCharClick = languageManager.getDisplayedCharHandler(
    selectedLanguage
  )

  const saveRecord = () => {
    setShowingRecordsInitScreen('Save')
  }

  const listRecords = () => {
    setShowingRecordsInitScreen('List')
  }

  if (!hasLoadedStorage) {
    return null
  }

  if (showingRecordsInitScreen) {
    return (
      <PanelBase onOverlayClick={onHideRequest}>
        <RecordsSection
          initScreen={showingRecordsInitScreen}
          selectedLanguage={selectedLanguage}
          onRecordLoad={(record: Record) => {
            clearValues()
            if (record.language !== selectedLanguage) {
              handleLanguageChange(record.language)
            }
            setShowingRecordsInitScreen('')
            setShowingEdition(false)
            setShowingPronunciation(false)
            setOriginalText(record.text)
            setPronunciation(record.pronunciation)
          }}
          text={originalTextValue}
          pronunciation={pronunciationValue}
          onRecordsClose={() => {
            setShowingRecordsInitScreen('')
          }}
        />
      </PanelBase>
    )
  }

  return (
    <PanelBase onOverlayClick={onHideRequest}>
      <Button onClick={clearValues}>Clear</Button>
      <Button onClick={listRecords}>Records</Button>
      <Button onClick={createToggleFn(isShowingEdition, setShowingEdition)}>
        Toggle Edition
      </Button>
      <Button
        onClick={createToggleFn(
          isShowingPronunciation,
          setShowingPronunciation
        )}
      >
        Toggle Pronunciation
      </Button>
      <ChooseLanguage
        languages={languageManager.getAvailableLanguages()}
        selectedLanguage={selectedLanguage}
        onOptionsChange={handleLanguageChange}
      />
      <Button onClick={saveRecord}>Save</Button>
      <Button onClick={onHideRequest} style={{ float: 'right' }}>
        Hide
      </Button>
      <div style={{ padding: '0 20px 20px 20px' }}>
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
            <OptionsBlock onOptionsChange={handleLanguageOptionsChange} />
          </div>
        )}{' '}
        <div>
          <div style={{ marginTop: 5, marginBottom: 10 }}>
            <CharactersDisplay
              charsObjs={charsObjs}
              focusedIndex={currentDisplayCharIdx}
              onCharClick={handleDisplayedCharClick}
              shouldHidePronunciation={!isShowingPronunciation}
            />
          </div>
          <TextArea
            onChange={createInputSetterFn(setWriting)}
            autoFocus
            onClick={handleWritingAreaClick}
            placeholder={practiceValue ? '' : 'Writing area'}
            rows={1}
            onKeyDown={handleWritingKeyDown}
            value={writingValue}
            withoutCursor
          />
          <TextArea
            autoScroll
            onChange={createInputSetterFn(setPractice)}
            placeholder={PRACTICE_TEXT_PLACEHOLDER}
            rows={3}
            value={practiceValue}
            style={{
              border: `1px solid ${doesPracticeHaveError ? 'red' : 'white'}`,
              fontSize: 46,
            }}
          />
        </div>
      </div>
      <LinksBlock text={originalTextValue} />
    </PanelBase>
  )
}

Panel.defaultProps = {
  _stories: {},
}

export default Panel
