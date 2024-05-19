import { LanguageDefinition, LanguageManager, Record } from '#/core'
import {
  ChangeEvent,
  useEffect,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
} from 'react'

import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage'
import 按鈕 from '../../components/按鈕/按鈕'
import 文字區 from '../../components/文字區/文字區'
import { 刪除資料庫, 取得字元數 } from '../../languages/common/統計'
import { LanguageUIManager } from '../../languages/languageUIManager'
import {
  類型_語言選項,
  T_getCurrentCharObjFromPractice,
  類型_文字片段列表,
} from '../../languages/types'
import { T_Services } from '../../typings/mainTypes'
import LoginWidget from '../LoginWidget/LoginWidget'
import RecordsSection, { RecordsScreen } from '../RecordsSection/RecordsSection'

const STORAGE_LANGUAGE_KEY = 'selectedLanguage'

const createInputSetterFn =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (setValue: any) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

const SHORTCUT_NEXT_FRAGMENT = 'Tab'
const defaultFontSize = 30

const PRACTICE_TEXT_PLACEHOLDER = `練習文本
下一個片段: ${SHORTCUT_NEXT_FRAGMENT}`

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
  onHideRequest?: () => void
  services: T_Services
  text: string
  UI?: {
    noHideButton?: boolean
  }
  關於改變主題?: () => void
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
  onHideRequest,
  services,
  text,
  UI,
  關於改變主題,
}: Props) => {
  const initialLanguageId = languageUIManager.getDefaultLanguage()
  const [, 觸發重新渲染] = useState<number>(0)
  const [stats, setStats] = useState<null | {
    correct: number
    fail: number
    perc: number
  }>(null)

  const 語言UI處理程序 = languageUIManager.獲取語言UI處理程序()

  const [文字片段列表, setFragments] = useState<類型_文字片段列表>({
    列表: [text],
    索引: 0,
  })

  const [showingRecordsInitScreen, setShowingRecordsInitScreen] = useState<
    RecordsScreen | ''
  >('')
  const [currentRecord, setCurrentRecord] = useState<Record['id'] | null>(null)
  const [currentText, setCurrentText] = useState<string>('')
  const originalTextValue = currentText || 文字片段列表.列表[文字片段列表.索引]
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
  const [練習有錯誤, 設定練習有錯誤] = useState<boolean>(false)
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageDefinition['id']>(initialLanguageId)
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [currentDisplayCharIdx, setCurrentDisplayCharIdx] = useState<number>(0)
  const [writingBorder, setWritingBorder] = useState<'bold' | 'normal'>('bold')
  const [有額外的控制, 設定有額外控件] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const writingArea = useRef<HTMLTextAreaElement | null>(null)
  const 語言選項 = _stories.語言選項 ?? 語言UI處理程序.取得語言選項()

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

  const onPracticeSourceChange = (newFragments?: 類型_文字片段列表) => {
    setCurrentText('')
    setPractice('')
    setWriting('')

    設定練習有錯誤(false)

    語言選項.錯誤的字符 = []

    if (newFragments) {
      setFragments(newFragments)
      storage.setValue('fragments', JSON.stringify(newFragments))
    }
  }

  const handleOriginalTextUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    const list = val
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const newFragments: 類型_文字片段列表 = {
      列表: list.length ? list : [''],
      索引: 0,
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

  const 字元對象列表 = langHandler?.轉換為字元對象列表({
    ...語言選項對象,
    charsToRemove,
    text: originalTextValue,
  })

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice = (
    practiceText = practiceValue,
  ) => {
    if (!langHandler) return null

    const practiceCharsObjs = langHandler.轉換為字元對象列表({
      ...語言選項對象,
      charsToRemove,
      text: practiceText,
    })

    return langHandler.getCurrentCharObj({
      originalCharsObjs: 字元對象列表 ?? [],
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

      if (value === SHORTCUT_NEXT_FRAGMENT) {
        e.preventDefault()

        const newFragments: 類型_文字片段列表 = {
          ...文字片段列表,
          索引: (文字片段列表.索引 + 1) % 文字片段列表.列表.length,
        }

        onPracticeSourceChange(newFragments)
      }
    }

    document.addEventListener('keydown', handleShortcuts)

    return () => {
      document.removeEventListener('keydown', handleShortcuts)
    }
  }, [isShowingEdition, isShowingPronunciation, 文字片段列表])

  const clearValues = () => {
    // eslint-disable-next-line no-extra-semi,padding-line-between-statements
    ;[setPronunciation, setSpecialChars, setWriting, setPractice].forEach(
      fn => {
        fn('')
      },
    )
    const newFragments: 類型_文字片段列表 = { 列表: [''], 索引: 0 }
    語言UI處理程序.處理清除事件?.(語言UI處理程序)
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

  const 處理寫鍵按下 = (事件: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    // 允許瀏覽器快捷鍵
    if (事件.ctrlKey) return

    if (事件.key === 'Enter') {
      setPractice(`${practiceValue}\n`)
    }

    語言UI處理程序.處理寫鍵按下({
      getCurrentCharObjFromPractice,
      originalTextValue,
      practiceValue,
      setCurrentDisplayCharIdx,
      setCurrentText,
      setPractice,
      setPracticeHasError: 設定練習有錯誤,
      setWriting,
      specialCharsValue: charsToRemove.join(''),
      writingValue,
      字元對象列表: 字元對象列表 ?? [],
      按鍵事件: 事件,
      語言選項,
    })

    語言UI處理程序.儲存語言選項(語言選項)
  }

  const 更改語言選項 = (選項: 類型_語言選項) => {
    語言UI處理程序.儲存語言選項(選項)
    觸發重新渲染(Math.random())
  }

  const 連結區塊 = 語言UI處理程序.取得連結區塊()
  const OptionsBlock = 語言UI處理程序.getOptionsBlock()

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
          const newFragments: 類型_文字片段列表 = {
            列表: record.text.split('\n'),
            索引: 0,
          }
          onPracticeSourceChange(newFragments)
          setCurrentRecord(record.id)
          setPronunciation(record.pronunciation)
        }}
        onRecordsClose={() => {
          setShowingRecordsInitScreen('')
        }}
        onSongLoad={lyrics => {
          const newFragments: 類型_文字片段列表 = {
            列表: lyrics,
            索引: 0,
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

  const 重點字元顏色 = 練習有錯誤
    ? 語言UI處理程序.取得錯誤顏色?.(語言選項, getCurrentCharObjFromPractice())
    : undefined

  return (
    <>
      <按鈕 onClick={clearValues} style={{ paddingLeft: 0 }}>
        清除文字
      </按鈕>
      <按鈕 onClick={() => 設定有額外控件(!有額外的控制)}>X</按鈕>
      {有額外的控制 && <按鈕 onClick={listRecords}>已儲存和歌曲</按鈕>}
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

                  const newFragments: 類型_文字片段列表 = {
                    列表: fileContent.split('\n'),
                    索引: 0,
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
      {有額外的控制 && (
        <>
          <LoginWidget />
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
          {關於改變主題 && <按鈕 onClick={關於改變主題}>改變主題</按鈕>}
          {!!stats && (
            <div className="flex-colum mb-[10px] flex text-[#ccc]">
              <div>截至上次會話的統計數據</div>
              <div>
                正確的: {stats.correct} ({stats.perc}%) / 失敗: {stats.fail}
              </div>
            </div>
          )}
        </>
      )}
      {文字片段列表.列表.length > 1 && (
        <按鈕
          onClick={() => {
            const newFragments = {
              ...文字片段列表,
              index: (文字片段列表.索引 + 1) % 文字片段列表.列表.length,
            }
            onPracticeSourceChange(newFragments)
          }}
        >
          當前小文本: {文字片段列表.索引 + 1} / {文字片段列表.列表.length}
        </按鈕>
      )}
      {文字片段列表.列表.length > 5 && (
        <按鈕
          onClick={() => {
            const newFragments = {
              ...文字片段列表,
              index:
                文字片段列表.索引 <= 0
                  ? 文字片段列表.列表.length - 1
                  : 文字片段列表.索引 - 1,
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
                if (語言UI處理程序.onBlur) {
                  const { newFragmentsList } = 語言UI處理程序.onBlur({
                    fragmentsList: 文字片段列表.列表,
                    語言選項,
                  })

                  if (newFragmentsList) {
                    const newFragments = {
                      ...文字片段列表,
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
              value={文字片段列表.列表.join('\n')}
            />
            {有額外的控制 && (
              <>
                <文字區
                  onChange={createInputSetterFn(setPronunciation)}
                  placeholder="發音"
                  rows={2}
                  value={pronunciationValue}
                />
                {langHandler && (
                  <OptionsBlock
                    更改語言選項={更改語言選項}
                    語言選項={語言選項}
                  />
                )}
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
              {langHandler && (
                <OptionsBlock 更改語言選項={更改語言選項} 語言選項={語言選項} />
              )}
            </div>
          </div>
        )}{' '}
        <div>
          <div style={{ marginBottom: 10, marginTop: 5 }}>
            <CharactersDisplay
              fontSize={fontSize}
              字元對象列表={字元對象列表 ?? []}
              應該有不同的寬度={!語言UI處理程序.shouldAllCharsHaveSameWidth}
              應該隱藏發音={!isShowingPronunciation}
              重點字元索引={currentDisplayCharIdx}
              重點字元顏色={重點字元顏色}
              顯示目前字元的發音={
                練習有錯誤 &&
                [undefined, '還原論者'].includes(
                  語言選項.遊戲模式值 as string | undefined,
                )
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
                } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>

                處理寫鍵按下(mockEvent)
              }
            }}
            onFocus={() => setWritingBorder('bold')}
            onKeyDown={處理寫鍵按下}
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
                練習有錯誤
                  ? 重點字元顏色 ?? 'red'
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
      <連結區塊
        文字={originalTextValue}
        文字片段列表={文字片段列表}
        更改文字片段列表={setFragments}
      />
    </>
  )
}

export default Panel
