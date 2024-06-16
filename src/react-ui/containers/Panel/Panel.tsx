import { LanguageDefinition, LanguageManager, Record } from '#/core'
import {
  ChangeEvent,
  useEffect,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { FaToolbox, FaTools } from 'react-icons/fa'

import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage'
import Button from '../../components/button/button'
import 文字區 from '../../components/文字區/文字區'
import { 刪除資料庫, 取得字元數 } from '../../languages/common/統計'
import { LanguageUIManager } from '../../languages/languageUIManager'
import {
  T_LangOpts,
  T_getCurrentCharObjFromPractice,
  T_Fragments,
} from '../../languages/types'
import { T_Services } from '../../typings/mainTypes'
import { AnkisMode, AnkisSection } from '../AnkisSection/AnkisSection'
import LoginWidget from '../LoginWidget/LoginWidget'
import RecordsSection, { RecordsScreen } from '../RecordsSection/RecordsSection'
import { useMainContext } from '../main-context'

const STORAGE_LANGUAGE_KEY = 'selectedLanguage'

const createInputSetterFn =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (setValue: any) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

const SHORTCUT_NEXT_FRAGMENT = 'Tab'
const defaultFontSize = 30

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
  const { t } = useTranslation()
  const initialLanguageId = languageUIManager.getDefaultLanguage()
  const {
    state: { isLoggedIn },
  } = useMainContext()
  const [, 觸發重新渲染] = useState<number>(0)
  const [stats, setStats] = useState<null | {
    correct: number
    fail: number
    perc: number
  }>(null)

  const 語言UI處理程序 = languageUIManager.獲取語言UI處理程序()

  const [fragments, setFragments] = useState<T_Fragments>({
    index: 0,
    list: [text],
  })

  const [showingAnkis, setShowingAnkis] = useState<AnkisMode | null>(null)
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
  const [practiceHasError, setPracticeHasError] = useState<boolean>(false)
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageDefinition['id']>(initialLanguageId)
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [currentDisplayCharIdx, setCurrentDisplayCharIdx] = useState<number>(0)
  const [writingBorder, setWritingBorder] = useState<'bold' | 'normal'>('bold')
  const [hasExtraControls, setHasExtraControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const writingArea = useRef<HTMLTextAreaElement | null>(null)
  const [displayMobileTones, setDisplayMobileTones] = useState<boolean | null>(
    null,
  )
  const langOpts = _stories.langOpts ?? 語言UI處理程序.getLangOpts()

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

  const onPracticeSourceChange = (newFragments?: T_Fragments) => {
    setCurrentText('')
    setPractice('')
    setWriting('')

    setPracticeHasError(false)

    langOpts.charsWithMistakes = []

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

    const newFragments: T_Fragments = {
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
      const savedDisplayTonesNum = await storage.getValue('displayTonesNum')

      if (savedFontSize) {
        const parsedFontSize = Number(savedFontSize)

        if (parsedFontSize) {
          setFontSize(parsedFontSize)
        }
      }

      if (savedDisplayTonesNum) {
        setDisplayMobileTones(savedDisplayTonesNum === 'true')
      }
    })()
  }, [storage])

  useEffect(() => {
    if (fontSize !== defaultFontSize) {
      storage.setValue('fontSize', fontSize.toString())
    } else {
      storage.setValue('fontSize', '')
    }
  }, [fontSize, storage])

  useEffect(() => {
    if (displayMobileTones === null) return

    storage.setValue('displayTonesNum', displayMobileTones.toString())
  }, [displayMobileTones, storage])

  useEffect(() => {
    if (!_stories.defaultLanguage) {
      return
    }

    updateLanguage(_stories.defaultLanguage)
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
  }, [initialFragmentIndex, storage])

  const 特殊字元 = langHandler?.取得特殊字符()
  const langOpts對象 = {
    langOpts: {
      pronunciationInput: pronunciationValue,
      ...((langOpts as unknown as T_LangOpts | undefined) ?? {}),
    },
  }

  const charsToRemove = specialCharsValue.split('').concat(特殊字元 ?? [])

  const charsObjsList = langHandler?.轉換為字元對象列表({
    ...langOpts對象,
    charsToRemove,
    text: originalTextValue,
  })

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice = (
    practiceText = practiceValue,
  ) => {
    if (!langHandler) return null

    const practiceCharsObjs = langHandler.轉換為字元對象列表({
      ...langOpts對象,
      charsToRemove,
      text: practiceText,
    })

    return langHandler.getCurrentCharObj({
      originalCharsObjs: charsObjsList ?? [],
      practiceCharsObjs,
    })
  }

  useEffect(() => {
    const practiceCharObj = getCurrentCharObjFromPractice()

    if (practiceCharObj?.ch && practiceCharObj.ch.pronunciation !== '?') {
      setCurrentDisplayCharIdx(practiceCharObj.index)
    }
    // eslint-disable-next-line
  }, [practiceValue, pronunciationValue])

  useEffect(() => {
    if (showingAnkis) return

    const handleShortcuts = (e: KeyboardEvent) => {
      const value = e.key

      if (value === SHORTCUT_NEXT_FRAGMENT) {
        e.preventDefault()

        const newFragments: T_Fragments = {
          ...fragments,
          index: (fragments.index + 1) % fragments.list.length,
        }

        onPracticeSourceChange(newFragments)
      }
    }

    document.addEventListener('keydown', handleShortcuts)

    return () => {
      document.removeEventListener('keydown', handleShortcuts)
    }
    // eslint-disable-next-line
  }, [isShowingEdition, isShowingPronunciation, fragments, showingAnkis])

  const clearValues = () => {
    // eslint-disable-next-line no-extra-semi,padding-line-between-statements
    ;[setPronunciation, setSpecialChars, setWriting, setPractice].forEach(
      fn => {
        fn('')
      },
    )
    const newFragments: T_Fragments = { index: 0, list: [''] }
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
    if (事件.ctrlKey || 事件.metaKey) return

    if (事件.key === 'Enter') {
      setPractice(`${practiceValue}\n`)
    }

    語言UI處理程序.處理寫鍵按下({
      charsObjsList: charsObjsList ?? [],
      getCurrentCharObjFromPractice,
      langOpts,
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
    })

    語言UI處理程序.saveLangOptss(langOpts)
  }

  const updateLangOpts = (選項: T_LangOpts) => {
    語言UI處理程序.saveLangOptss(選項)
    觸發重新渲染(Math.random())
  }

  const LinksBlock = 語言UI處理程序.getLinksBlock()
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

  if (showingAnkis) {
    return (
      <AnkisSection
        charsObjsList={charsObjsList ?? []}
        language={selectedLanguage}
        mode={showingAnkis}
        setMode={mode => {
          setShowingAnkis(mode)
        }}
      />
    )
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
          const newFragments: T_Fragments = {
            index: 0,
            list: record.text.split('\n'),
          }
          onPracticeSourceChange(newFragments)
          setCurrentRecord(record.id)
          setPronunciation(record.pronunciation)
        }}
        onRecordsClose={() => {
          setShowingRecordsInitScreen('')
        }}
        onSongLoad={lyrics => {
          const newFragments: T_Fragments = {
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

  const colorOfCurrentChar = practiceHasError
    ? 語言UI處理程序.取得錯誤顏色?.(langOpts, getCurrentCharObjFromPractice())
    : undefined

  const { tonesNumber } = 語言UI處理程序

  return (
    <>
      <div className="flex flex-row flex-wrap gap-[12px]">
        <Button onClick={clearValues}>{t('panel.clear')}</Button>
        <Button onClick={() => setHasExtraControls(!hasExtraControls)}>
          {hasExtraControls ? <FaTools /> : <FaToolbox />}
        </Button>
        {hasExtraControls && (
          <Button onClick={listRecords}>{t('panel.recordSongs')}</Button>
        )}
        {hasExtraControls && isMobile && (
          <Button
            onClick={() => {
              setDisplayMobileTones(!displayMobileTones)
            }}
          >
            {displayMobileTones
              ? t('panel.hideTones')
              : t('panel.displayTones')}
          </Button>
        )}
        {hasExtraControls && isLoggedIn && (
          <Button
            onClick={() => {
              setShowingAnkis(AnkisMode.Main)
            }}
          >
            {t('panel.openAnki')}
          </Button>
        )}
        <Button
          onClick={() => {
            navigator.clipboard.writeText(originalTextValue)
          }}
        >
          {t('panel.copy')}
        </Button>
        {isLoggedIn && !hasExtraControls && (
          <Button
            onClick={() => {
              setShowingAnkis(AnkisMode.Add)
            }}
          >
            {t('panel.addAnkis')}
          </Button>
        )}
        {isShowingEdition && (
          <>
            <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
              <Button>{t('panel.importFile')}</Button>
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

                    const newFragments: T_Fragments = {
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
              {t('panel.togglePronunciation')}
            </Button>
          </>
        )}
        {hasExtraControls && (
          <>
            <LoginWidget />
            <Button
              onClick={() => {
                setShowingEdition(!isShowingEdition)
                writingArea.current?.focus()
              }}
            >
              {t('panel.toggleEdition')}
            </Button>
            <ChooseLanguage
              languages={getLanguageDefinitions(languageManager)}
              onOptionsChange={handleLanguageChange}
              selectedLanguage={selectedLanguage}
            />
            <Button onClick={saveRecord}>
              {currentRecord === null
                ? t('panel.saveRecord')
                : t('panel.updateRecord')}
            </Button>
            {onChangeTheme && (
              <Button onClick={onChangeTheme}>{t('panel.changeTheme')}</Button>
            )}
            {!!stats && (
              <div className="mb-[10px] flex flex-row items-center gap-[8px] text-[#ccc]">
                <div>{t('panel.lastSessionNotice')}</div>
                <div className="border-[1px] border-solid p-[4px]">
                  {t('panel.correct')}: {stats.correct} ({stats.perc}%) /{' '}
                  {t('panel.wrong')}: {stats.fail}
                </div>
                <Button
                  onDoubleClick={() => {
                    刪除資料庫().then(() => {
                      setStats(null)
                    })
                  }}
                >
                  {t('panel.deleteStats')}
                </Button>
              </div>
            )}
          </>
        )}
        {fragments.list.length > 1 && (
          <Button
            onClick={() => {
              const newFragments: T_Fragments = {
                ...fragments,
                index: (fragments.index + 1) % fragments.list.length,
              }
              onPracticeSourceChange(newFragments)
            }}
          >
            {t('panel.currentFragment')}: {fragments.index + 1} /{' '}
            {fragments.list.length}
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
            {t('panel.previousFragment')}
          </Button>
        )}
        {currentRecord !== null && (
          <Button
            onClick={() => {
              setCurrentRecord(null)
            }}
          >
            {t('panel.closeRecord')}
          </Button>
        )}
        <Button
          onClick={onHideRequest ?? undefined}
          style={{
            display: UI?.noHideButton ? 'none' : 'block',
            float: 'right',
          }}
        >
          {t('panel.hide')}
        </Button>
      </div>
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
                    fragmentsList: fragments.list,
                    langOpts,
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
              placeholder={t('panel.sourceText')}
              rows={3}
              value={fragments.list.join('\n')}
            />
            {hasExtraControls && (
              <>
                <文字區
                  onChange={createInputSetterFn(setPronunciation)}
                  placeholder={t('panel.pronunciation')}
                  rows={2}
                  value={pronunciationValue}
                />
                {langHandler && (
                  <OptionsBlock
                    langOpts={langOpts}
                    updateLangOpts={updateLangOpts}
                  />
                )}
                <文字區
                  onChange={createInputSetterFn(setSpecialChars)}
                  placeholder={t('panel.specialChars')}
                  rows={1}
                  value={specialCharsValue}
                />
                <div style={{ fontSize: '12px' }}>
                  {t('panel.charSize')}:{' '}
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
              {langHandler && (
                <OptionsBlock
                  langOpts={langOpts}
                  updateLangOpts={updateLangOpts}
                />
              )}
            </div>
          </div>
        )}{' '}
        <div>
          <div style={{ marginBottom: 10, marginTop: 5 }}>
            <CharactersDisplay
              charsObjsList={charsObjsList ?? []}
              colorOfCurrentChar={colorOfCurrentChar}
              fontSize={fontSize}
              onSymbolClick={() => {
                setShowingEdition(false)
                setHasExtraControls(false)
                setShowingPronunciation(false)
                writingArea.current?.focus()
              }}
              應該有不同的寬度={!語言UI處理程序.shouldAllCharsHaveSameWidth}
              應該隱藏發音={!isShowingPronunciation}
              重點字元索引={currentDisplayCharIdx}
              顯示目前字元的發音={
                practiceHasError &&
                [undefined, '還原論者'].includes(
                  langOpts.遊戲模式值 as string | undefined,
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
            placeholder={practiceValue ? '' : t('panel.writingArea')}
            rows={1}
            setRef={ref => (writingArea.current = ref)}
            style={{
              borderWidth: writingBorder === 'bold' ? 2 : 1,
            }}
            value={writingValue}
            無遊標
          />
          <文字區
            onChange={createInputSetterFn(setPractice)}
            onFocus={() => {
              writingArea.current?.focus()
            }}
            placeholder=""
            rows={3}
            style={{
              border: `4px solid ${
                practiceHasError
                  ? colorOfCurrentChar ?? 'red'
                  : 'var(--color-background, "white")'
              }`,
              fontSize,
              lineHeight: `${fontSize + 10}px`,
              maxHeight: isMobile ? '100px' : undefined,
            }}
            value={practiceValue}
            自動捲動
          />
          {isMobile && displayMobileTones && tonesNumber && (
            <div className="flex w-full flex-row justify-between bg-[black]">
              {Array.from({ length: tonesNumber }).map((_, idx) => {
                return (
                  <Button
                    key={idx}
                    onClick={() => {
                      處理寫鍵按下({
                        key: (idx + 1).toString(),
                        preventDefault: () => {},
                      } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>)
                      writingArea.current?.focus()
                    }}
                  >
                    {idx + 1}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mb-[12px] flex flex-row flex-wrap justify-start gap-[12px]">
        <LinksBlock
          fragments={fragments}
          文字={originalTextValue}
          更改fragments={setFragments}
        />
      </div>
    </>
  )
}

export default Panel
