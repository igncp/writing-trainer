import React, { useEffect, useRef, useState } from 'react'
import {
  LanguageDefinition,
  LanguageManager,
  Record,
} from 'writing-trainer-core'

import Button from '../../components/Button/Button'
import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage'
import TextArea from '../../components/TextArea/TextArea'
import { deleteDB, getCharsCount } from '../../languages/common/stats'
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

const SHORTCUT_EDITING = 'control+control+shift'
const SHORTCUT_PRONUNCIATION = 'shift+shift+control'
const SHORTCUT_NEXT_FRAGMENT = 'Tab'
const SHORTCUT_WRITING = 'w'
const defaultFontSize = 30

const PRACTICE_TEXT_PLACEHOLDER = `Practice Text
Next fragment: ${SHORTCUT_NEXT_FRAGMENT}
Toggle Editing: ${SHORTCUT_EDITING}
Toggle Pronunciation: ${SHORTCUT_PRONUNCIATION}
Focus Writing (if no input has focus): ${SHORTCUT_WRITING}`

type Props = {
  _stories?: {
    defaultLanguage?: LanguageDefinition['id']
    defaultPractice?: string
    defaultPronunciation?: string
    langOpts?: T_LangOpts
  }
  initialFragmentIndex?: number
  languageManager: LanguageManager
  languageUIManager: LanguageUIManager
  onChangeTheme?: () => void
  onHideRequest?: () => void
  services: T_Services
  text: string
  UI?: {
    noHideButton?: boolean
  }
}

const getLanguageDefinitions = (languageManager: LanguageManager) => {
  return languageManager
    .getAvailableLanguages()
    .map(langId => {
      const languageHandler = languageManager.getLanguageHandler(langId)

      if (!languageHandler) return null

      return {
        id: languageHandler.getId(),
        name: languageHandler.getName(),
      }
    })
    .filter(item => !!item) as Array<{
    id: LanguageDefinition['id']
    name: string
  }>
}

const Panel = ({
  _stories = {},
  initialFragmentIndex,
  languageManager,
  languageUIManager,
  onChangeTheme,
  onHideRequest,
  services,
  text,
  UI,
}: Props) => {
  const initialLanguageId = languageUIManager.getDefaultLanguage()
  const [stats, setStats] = useState<null | {
    correct: number
    fail: number
    perc: number
  }>(null)

  const [fragments, setFragments] = useState<{ index: number; list: string[] }>(
    {
      index: 0,
      list: [text],
    },
  )

  const [showingRecordsInitScreen, setShowingRecordsInitScreen] = useState<
    RecordsScreen | ''
  >('')
  const [currentRecord, setCurrentRecord] = useState<Record['id'] | null>(null)
  const [currentText, setCurrentText] = useState<string>('')
  const originalTextValue = currentText || fragments.list[fragments.index]
  const [pronunciationValue, setPronunciation] = useState<string>(
    _stories.defaultPronunciation ?? '',
  )
  const [specialCharsValue, setSpecialChars] = useState<string>('')
  const [writingValue, setWriting] = useState<string>('')
  const [practiceValue, setPractice] = useState<string>(
    _stories.defaultPractice ?? '',
  )
  const [fontSize, setFontSize] = useState<number>(defaultFontSize)
  const [isShowingPronunciation, setShowingPronunciation] = useState(true)
  const [isShowingEdition, setShowingEdition] = useState<boolean>(true)
  const [doesPracticeHaveError, setPracticeHasError] = useState<boolean>(false)
  const [lastThreeKeys, setLastThreeKeys] = useState<string[]>([])
  const [languageOptions, setLanguageOptions] = useState<T_LangOpts>({})
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageDefinition['id']>(initialLanguageId)
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [currentDisplayCharIdx, setCurrentDisplayCharIdx] = useState<number>(0)
  const [writingBorder, setWritingBorder] = useState<'bold' | 'normal'>('bold')
  const [hasExtraControls, setHasExtraControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const writingArea = useRef<HTMLTextAreaElement | null>(null)

  const uiHandler = languageUIManager.getUIHandler()

  const langHandler = languageManager.getCurrentLanguageHandler()

  const { storage } = services

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return

    getCharsCount()
      .then(({ failCount, successCount }) => {
        const total = (successCount ?? 0) + (failCount ?? 0)

        setStats({
          correct: successCount ?? 0,
          fail: failCount ?? 0,
          perc: total > 0 ? Math.round(((successCount ?? 0) / total) * 100) : 0,
        })
      })
      .catch(() => {})
  }, [])

  const onPracticeSourceChange = (newFragments?: {
    index: number
    list: string[]
  }) => {
    setCurrentText('')
    setPractice('')
    setWriting('')

    setPracticeHasError(false)

    languageOptions.wrongCharacters = []

    if (newFragments) {
      setFragments(newFragments)
      storage.setValue('fragments', JSON.stringify(newFragments))
    }
  }

  const handleOriginalTextUpdate = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const val = e.target.value
    const list = val
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const newFragments = {
      index: 0,
      list: list.length ? list : [''],
    }

    onPracticeSourceChange(newFragments)
  }

  const updateLanguage = (lang: LanguageDefinition['id']) => {
    languageManager.setCurrentLanguageHandler(lang)
    setSelectedLanguage(lang)
  }

  useEffect(() => {
    const listener = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    listener()

    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line
    ;(async () => {
      const savedFontSize = await storage.getValue('fontSize')

      if (savedFontSize) {
        const parsedFontSize = Number(savedFontSize)

        if (parsedFontSize) {
          setFontSize(parsedFontSize)
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (fontSize !== defaultFontSize) {
      storage.setValue('fontSize', fontSize.toString())
    } else {
      storage.setValue('fontSize', '')
    }
  }, [fontSize])

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

  useEffect(() => {
    // eslint-disable-next-line
    ;(async () => {
      const lastFragments = await storage.getValue('fragments')

      if (lastFragments) {
        const parsedFragments = JSON.parse(lastFragments)

        setFragments({
          ...parsedFragments,
          ...(initialFragmentIndex !== undefined && {
            index: initialFragmentIndex,
          }),
        })
      }
    })()
  }, [initialFragmentIndex])

  const SPECIAL_CHARS = langHandler!.getSpecialChars()
  const langOpts = _stories.langOpts ?? uiHandler.getLangOpts()
  const langOptsObj = {
    langOpts: {
      pronunciationInput: pronunciationValue,
      ...((langOpts as unknown as object | undefined) ?? {}),
    },
  }

  const charsToRemove = specialCharsValue.split('').concat(SPECIAL_CHARS)

  const charsObjs = langHandler!.convertToCharsObjs({
    ...langOptsObj,
    charsToRemove,
    text: originalTextValue,
  })

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice = (
    practiceText = practiceValue,
  ) => {
    const practiceCharsObjs = langHandler!.convertToCharsObjs({
      ...langOptsObj,
      charsToRemove,
      text: practiceText,
    })

    return langHandler!.getCurrentCharObj({
      originalCharsObjs: charsObjs,
      practiceCharsObjs,
    })
  }

  useEffect(() => {
    const practiceCharObj = getCurrentCharObjFromPractice()

    if (practiceCharObj?.ch && practiceCharObj.ch.pronunciation !== '?') {
      setCurrentDisplayCharIdx(practiceCharObj.index)
    }
  }, [practiceValue, pronunciationValue])

  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      const value = e.key
      const newArr = lastThreeKeys.slice(-2).concat([value])
      const currentResult = newArr.join('+').toLowerCase()

      if (value === SHORTCUT_NEXT_FRAGMENT) {
        e.preventDefault()

        const newFragments = {
          ...fragments,
          index: (fragments.index + 1) % fragments.list.length,
        }

        onPracticeSourceChange(newFragments)
      }

      if (currentResult === SHORTCUT_PRONUNCIATION) {
        setShowingPronunciation(!isShowingPronunciation)
      } else if (currentResult === SHORTCUT_EDITING) {
        setShowingEdition(!isShowingEdition)
      } else if (
        value === SHORTCUT_WRITING &&
        (!document.activeElement || document.activeElement === document.body)
      ) {
        e.preventDefault()
        writingArea.current?.focus()
      }
      setLastThreeKeys(newArr)
    }

    document.addEventListener('keydown', handleShortcuts)

    return () => {
      document.removeEventListener('keydown', handleShortcuts)
    }
  }, [lastThreeKeys, isShowingEdition, isShowingPronunciation, fragments])

  const clearValues = () => {
    // eslint-disable-next-line no-extra-semi,padding-line-between-statements
    ;[setPronunciation, setSpecialChars, setWriting, setPractice].forEach(
      fn => {
        fn('')
      },
    )
    const newFragments = { index: 0, list: [''] }
    storage.setValue('fragments', JSON.stringify(newFragments))
    setShowingPronunciation(true)
    setShowingEdition(true)
    setCurrentRecord(null)
    onPracticeSourceChange(newFragments)
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
      setCurrentText,
      setPractice,
      setPracticeHasError,
      setWriting,
      specialCharsValue: charsToRemove.join(''),
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
          const newFragments = { index: 0, list: record.text.split('\n') }
          onPracticeSourceChange(newFragments)
          setCurrentRecord(record.id)
          setPronunciation(record.pronunciation)
        }}
        onRecordsClose={() => {
          setShowingRecordsInitScreen('')
        }}
        onSongLoad={lyrics => {
          const newFragments = {
            index: 0,
            list: lyrics,
          }
          onPracticeSourceChange(newFragments)
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
      <Button onClick={clearValues} style={{ paddingLeft: 0 }}>
        Clear
      </Button>
      <Button onClick={() => setHasExtraControls(!hasExtraControls)}>X</Button>
      {hasExtraControls && <Button onClick={listRecords}>Records</Button>}
      <Button
        onClick={() => {
          navigator.clipboard.writeText(originalTextValue)
        }}
      >
        Copy
      </Button>
      {isShowingEdition && (
        <>
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <Button>Upload</Button>
            <input
              id="file-input"
              onChange={() => {
                const fileEl = document.getElementById(
                  'file-input',
                ) as HTMLInputElement | null

                if (!fileEl) return

                const file = fileEl.files?.[0]

                if (!file) {
                  return
                }

                // eslint-disable-next-line
                ;(async () => {
                  let fileContent = await file.text()

                  if (['.srt', '.vtt'].find(ext => file.name.endsWith(ext))) {
                    fileContent = fileContent
                      .split('\n')
                      .map(line => line.trim())
                      .filter(
                        line =>
                          !!line &&
                          !line.includes('-->') &&
                          !/^[0-9]*$/.test(line),
                      )
                      .join('\n')
                  }

                  const newFragments = {
                    index: 0,
                    list: fileContent.split('\n'),
                  }

                  onPracticeSourceChange(newFragments)
                  setShowingEdition(false)
                  setShowingPronunciation(false)
                })()
              }}
              style={{ display: 'none' }}
              type="file"
            />
          </label>
          <Button
            onClick={() => {
              setShowingPronunciation(!isShowingPronunciation)
              writingArea.current?.focus()
            }}
          >
            Toggle Pronunciation
          </Button>
        </>
      )}
      {hasExtraControls && (
        <>
          <Button
            onClick={() => {
              setShowingEdition(!isShowingEdition)
              writingArea.current?.focus()
            }}
          >
            Toggle Edition
          </Button>
          <ChooseLanguage
            languages={getLanguageDefinitions(languageManager)}
            onOptionsChange={handleLanguageChange}
            selectedLanguage={selectedLanguage}
          />
          <Button onClick={saveRecord}>
            {currentRecord === null ? 'Save' : 'Update'}
          </Button>
          {onChangeTheme && (
            <Button onClick={onChangeTheme}>Change Theme</Button>
          )}
          {!!stats && (
            <div
              style={{
                color: '#ccc',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 10,
              }}
            >
              <div>Stats up until last session</div>
              <div>
                Correct: {stats.correct} ({stats.perc}%) / Fail: {stats.fail}
              </div>
              <Button
                onClick={() => {
                  deleteDB().then(() => {
                    setStats(null)
                  })
                }}
              >
                Delete DB
              </Button>
            </div>
          )}
        </>
      )}
      {fragments.list.length > 1 && (
        <Button
          onClick={() => {
            const newFragments = {
              ...fragments,
              index: (fragments.index + 1) % fragments.list.length,
            }
            onPracticeSourceChange(newFragments)
          }}
        >
          Current Fragment: {fragments.index + 1} / {fragments.list.length}
        </Button>
      )}
      {fragments.list.length > 5 && (
        <Button
          onClick={() => {
            const newFragments = {
              ...fragments,
              index:
                fragments.index <= 0
                  ? fragments.list.length - 1
                  : fragments.index - 1,
            }
            onPracticeSourceChange(newFragments)
          }}
        >
          Prev Fragment
        </Button>
      )}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <TextArea
              onBlur={() => {
                if (uiHandler.onBlur) {
                  const { newFragmentsList } = uiHandler.onBlur({
                    fragmentsList: fragments.list,
                    languageOptions,
                  })

                  if (newFragmentsList) {
                    const newFragments = {
                      ...fragments,
                      list: newFragmentsList,
                    }

                    onPracticeSourceChange(newFragments)
                  }
                }

                setShowingEdition(false)
                setShowingPronunciation(false)
                writingArea.current?.focus()
              }}
              onChange={handleOriginalTextUpdate}
              placeholder="Original text"
              rows={3}
              value={fragments.list.join('\n')}
            />
            {hasExtraControls && (
              <>
                <TextArea
                  onChange={createInputSetterFn(setPronunciation)}
                  placeholder="Pronunciation"
                  rows={2}
                  value={pronunciationValue}
                />
                <OptionsBlock
                  languageOptions={languageOptions}
                  onOptionsChange={handleLanguageOptionsChange}
                />
                <TextArea
                  onChange={createInputSetterFn(setSpecialChars)}
                  placeholder="Special characters"
                  rows={1}
                  value={specialCharsValue}
                />
                <div style={{ fontSize: '12px' }}>
                  Font size:{' '}
                  <input
                    onChange={event => {
                      setFontSize(Number(event.target.value))
                    }}
                    type="number"
                    value={fontSize}
                  />
                </div>
              </>
            )}
            {/* This is necessary because the options block initialises some values*/}
            <div style={{ display: 'none' }}>
              <OptionsBlock
                languageOptions={languageOptions}
                onOptionsChange={handleLanguageOptionsChange}
              />
            </div>
          </div>
        )}{' '}
        <div>
          <div style={{ marginBottom: 10, marginTop: 5 }}>
            <CharactersDisplay
              charsObjs={charsObjs}
              focusedIndex={currentDisplayCharIdx}
              fontSize={fontSize}
              onCharClick={handleDisplayedCharClick}
              shouldHaveDifferentWidths={!uiHandler.shouldAllCharsHaveSameWidth}
              shouldHidePronunciation={!isShowingPronunciation}
              showCurrentCharPronunciation={
                doesPracticeHaveError &&
                languageOptions.playmodeValue === 'reductive'
              }
            />
          </div>
          <TextArea
            autoFocus
            onBlur={() => setWritingBorder('normal')}
            onChange={e => {
              const diff = e.target.value.length - writingValue.length

              setWriting(e.target.value)

              // Simulate the keydown event again to support mobile web
              if (diff === 1) {
                const mockEvent = {
                  key: e.target.value.slice(-1),
                  preventDefault: () => {},
                } as unknown as React.KeyboardEvent<HTMLTextAreaElement>

                handleWritingKeyDown(mockEvent)
              }
            }}
            onClick={handleWritingAreaClick}
            onFocus={() => setWritingBorder('bold')}
            onKeyDown={handleWritingKeyDown}
            placeholder={practiceValue ? '' : 'Writing area'}
            rows={1}
            setRef={ref => (writingArea.current = ref)}
            style={{ borderWidth: writingBorder === 'bold' ? 2 : 1 }}
            value={writingValue}
            withoutCursor
          />
          <TextArea
            autoScroll
            onChange={createInputSetterFn(setPractice)}
            onFocus={() => {
              writingArea.current?.focus()
            }}
            placeholder={isMobile ? '...' : PRACTICE_TEXT_PLACEHOLDER}
            rows={3}
            style={{
              border: `4px solid ${
                doesPracticeHaveError
                  ? 'red'
                  : 'var(--color-background, "white")'
              }`,
              fontSize,
              lineHeight: `${fontSize + 10}px`,
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
