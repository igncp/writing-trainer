import React, { useEffect, useRef, useState } from 'react'
import {
  LanguageDefinition,
  LanguageManager,
  Record,
} from 'writing-trainer-core'

import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage'
import 按鈕 from '../../components/按鈕/按鈕'
import 文字區 from '../../components/文字區/文字區'
import { 刪除資料庫, 取得字元數 } from '../../languages/common/統計'
import { LanguageUIManager } from '../../languages/languageUIManager'
import {
  類型_語言選項,
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
const defaultFontSize = 30

const PRACTICE_TEXT_PLACEHOLDER = `練習文本
下一個片段: ${SHORTCUT_NEXT_FRAGMENT}
切換編輯: ${SHORTCUT_EDITING}
切換發音: ${SHORTCUT_PRONUNCIATION}`

type Props = {
  _stories?: {
    defaultLanguage?: LanguageDefinition['id']
    defaultPractice?: string
    defaultPronunciation?: string
    語言選項?: 類型_語言選項
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
    .取得可用語言()
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

  const uiHandler = languageUIManager.getUIHandler()

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
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageDefinition['id']>(initialLanguageId)
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [currentDisplayCharIdx, setCurrentDisplayCharIdx] = useState<number>(0)
  const [writingBorder, setWritingBorder] = useState<'bold' | 'normal'>('bold')
  const [hasExtraControls, setHasExtraControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const writingArea = useRef<HTMLTextAreaElement | null>(null)
  const 語言選項 = _stories.語言選項 ?? uiHandler.取得語言選項()

  const langHandler = languageManager.getCurrentLanguageHandler()

  const { storage } = services

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return

    取得字元數()
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

    語言選項.錯誤的字符 = []

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

  const 特殊字元 = langHandler?.取得特殊字符()
  const 語言選項對象 = {
    語言選項: {
      pronunciationInput: pronunciationValue,
      ...((語言選項 as unknown as 類型_語言選項 | undefined) ?? {}),
    },
  }

  const charsToRemove = specialCharsValue.split('').concat(特殊字元 ?? [])

  const charsObjs = langHandler?.convertToCharsObjs({
    ...語言選項對象,
    charsToRemove,
    text: originalTextValue,
  })

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice = (
    practiceText = practiceValue,
  ) => {
    if (!langHandler) return null

    const practiceCharsObjs = langHandler.convertToCharsObjs({
      ...語言選項對象,
      charsToRemove,
      text: practiceText,
    })

    return langHandler.getCurrentCharObj({
      originalCharsObjs: charsObjs ?? [],
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
    事件: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    // special key
    if (事件.key === '`') {
      事件.preventDefault()
      setWriting('')
      setPracticeHasError(false)

      return
    }

    if (事件.key === 'Enter') {
      setPractice(`${practiceValue}\n`)
    }

    uiHandler.handleWritingKeyDown({
      charsObjs: charsObjs ?? [],
      getCurrentCharObjFromPractice,
      originalTextValue,
      practiceValue,
      setCurrentDisplayCharIdx,
      setCurrentText,
      setPractice,
      setPracticeHasError,
      setWriting,
      specialCharsValue: charsToRemove.join(''),
      writingValue,
      按鍵事件: 事件,
      語言選項,
    })

    uiHandler.儲存語言選項(語言選項)
  }

  const 更改語言選項 = (選項: 類型_語言選項) => {
    uiHandler.儲存語言選項(選項)
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
      <按鈕 onClick={clearValues} style={{ paddingLeft: 0 }}>
        清除文字
      </按鈕>
      <按鈕 onClick={() => setHasExtraControls(!hasExtraControls)}>X</按鈕>
      {hasExtraControls && <按鈕 onClick={listRecords}>已儲存和歌曲</按鈕>}
      <按鈕
        onClick={() => {
          navigator.clipboard.writeText(originalTextValue)
        }}
      >
        複製
      </按鈕>
      {isShowingEdition && (
        <>
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <按鈕>上傳文件</按鈕>
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
          <按鈕
            onClick={() => {
              setShowingPronunciation(!isShowingPronunciation)
              writingArea.current?.focus()
            }}
          >
            切換發音
          </按鈕>
        </>
      )}
      {hasExtraControls && (
        <>
          <按鈕
            onClick={() => {
              setShowingEdition(!isShowingEdition)
              writingArea.current?.focus()
            }}
          >
            切換版本
          </按鈕>
          <ChooseLanguage
            languages={getLanguageDefinitions(languageManager)}
            onOptionsChange={handleLanguageChange}
            selectedLanguage={selectedLanguage}
          />
          <按鈕 onClick={saveRecord}>
            {currentRecord === null ? '儲存' : '更新'}
          </按鈕>
          {onChangeTheme && <按鈕 onClick={onChangeTheme}>改變主題</按鈕>}
          {!!stats && (
            <div
              style={{
                color: '#ccc',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 10,
              }}
            >
              <div>截至上次會話的統計數據</div>
              <div>
                正確的: {stats.correct} ({stats.perc}%) / 失敗: {stats.fail}
              </div>
            </div>
          )}
        </>
      )}
      {fragments.list.length > 1 && (
        <按鈕
          onClick={() => {
            const newFragments = {
              ...fragments,
              index: (fragments.index + 1) % fragments.list.length,
            }
            onPracticeSourceChange(newFragments)
          }}
        >
          當前小文本: {fragments.index + 1} / {fragments.list.length}
        </按鈕>
      )}
      {fragments.list.length > 5 && (
        <按鈕
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
          之前的小文字
        </按鈕>
      )}
      {currentRecord !== null && (
        <按鈕
          onClick={() => {
            setCurrentRecord(null)
          }}
        >
          關閉已儲存的文本
        </按鈕>
      )}
      <按鈕
        onClick={onHideRequest ?? undefined}
        style={{
          display: UI?.noHideButton ? 'none' : 'block',
          float: 'right',
        }}
      >
        隱藏
      </按鈕>
      <div style={{ padding: '0 0 20px' }}>
        {isShowingEdition && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <文字區
              onBlur={() => {
                if (uiHandler.onBlur) {
                  const { newFragmentsList } = uiHandler.onBlur({
                    fragmentsList: fragments.list,
                    語言選項,
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
              placeholder="原文"
              rows={3}
              value={fragments.list.join('\n')}
            />
            {hasExtraControls && (
              <>
                <文字區
                  onChange={createInputSetterFn(setPronunciation)}
                  placeholder="發音"
                  rows={2}
                  value={pronunciationValue}
                />
                <OptionsBlock 更改語言選項={更改語言選項} 語言選項={語言選項} />
                <文字區
                  onChange={createInputSetterFn(setSpecialChars)}
                  placeholder="特殊字元"
                  rows={1}
                  value={specialCharsValue}
                />
                <div style={{ fontSize: '12px' }}>
                  字體大小:{' '}
                  <input
                    onChange={event => {
                      setFontSize(Number(event.target.value))
                    }}
                    type="number"
                    value={fontSize}
                  />
                </div>
                <按鈕
                  onDoubleClick={() => {
                    刪除資料庫().then(() => {
                      setStats(null)
                    })
                  }}
                >
                  刪除資料庫
                </按鈕>
              </>
            )}
            {/* This is necessary because the options block initialises some values*/}
            <div style={{ display: 'none' }}>
              <OptionsBlock 更改語言選項={更改語言選項} 語言選項={語言選項} />
            </div>
          </div>
        )}{' '}
        <div>
          <div style={{ marginBottom: 10, marginTop: 5 }}>
            <CharactersDisplay
              charsObjs={charsObjs ?? []}
              focusedIndex={currentDisplayCharIdx}
              fontSize={fontSize}
              onCharClick={handleDisplayedCharClick}
              shouldHaveDifferentWidths={!uiHandler.shouldAllCharsHaveSameWidth}
              shouldHidePronunciation={!isShowingPronunciation}
              showCurrentCharPronunciation={
                doesPracticeHaveError && 語言選項.遊戲模式值 === '還原論者'
              }
            />
          </div>
          <文字區
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
            placeholder={practiceValue ? '' : '書寫區'}
            rows={1}
            setRef={ref => (writingArea.current = ref)}
            style={{ borderWidth: writingBorder === 'bold' ? 2 : 1 }}
            value={writingValue}
            無遊標
          />
          <文字區
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
            自動捲動
          />
        </div>
      </div>
      <LinksBlock text={originalTextValue} />
    </>
  )
}

export default Panel
