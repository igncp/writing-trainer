import {
  LanguageDefinition,
  LanguageManager,
  Record as CoreRecord,
} from '#/core'
import {
  doStatsCheck,
  getMostFailures,
} from '#/react-ui/languages/common/stats'
import { Paths } from '#/react-ui/lib/paths'
import {
  ChangeEvent,
  useEffect,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
  Fragment,
} from 'react'
import { useTranslation } from 'react-i18next'
import { CgSpinnerAlt } from 'react-icons/cg'
import { FaToolbox, FaTools } from 'react-icons/fa'

import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage'
import TextArea from '../../components/TextArea/TextArea'
import Button from '../../components/button/button'
import { LanguageUIManager } from '../../languages/languageUIManager'
import {
  T_LangOpts,
  T_getCurrentCharObjFromPractice,
  T_Fragments,
} from '../../languages/types'
import { T_Services } from '../../typings/mainTypes'
import {
  ankiModeToPath,
  AnkisMode,
  AnkisSection,
} from '../AnkisSection/AnkisSection'
import LoginWidget from '../LoginWidget/LoginWidget'
import RecordsSection, {
  recordsModeToPath,
  RecordsScreen,
} from '../RecordsSection/RecordsSection'
import { StatsSection } from '../StatsSection/StatsSection'
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
  getPath: () => string
  initialFragmentIndex?: number
  languageManager: LanguageManager
  languageUIManager: LanguageUIManager
  onChangeTheme?: () => void
  onHideRequest?: () => void
  replacePath: (path: string) => void
  services: T_Services
  text: string
  UI?: {
    noHideButton?: boolean
  }
}

const getLanguageDefinitions = (languageManager: LanguageManager) => {
  return languageManager
    .getAvailableLangs()
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
  getPath,
  initialFragmentIndex,
  languageManager,
  languageUIManager,
  onChangeTheme,
  onHideRequest,
  replacePath,
  services,
  text,
  UI,
}: Props) => {
  const { t } = useTranslation()
  const initialLanguageId = languageUIManager.getDefaultLanguage()
  const path = getPath()

  const {
    state: { isLoggedIn },
  } = useMainContext()

  const [, 觸發重新渲染] = useState<number>(0)

  const languageUIController = languageUIManager.getLanguageUIController()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [fragments, setFragments] = useState<T_Fragments>({
    index: 0,
    list: [text],
  })

  const showingAnkis = (Object.entries(ankiModeToPath).find(
    ([, value]) => value === path,
  )?.[0] ?? null) as AnkisMode | null

  const showingRecordsInitScreen = (Object.entries(recordsModeToPath).find(
    ([, value]) => value === path,
  )?.[0] ?? null) as RecordsScreen | null

  const showingStatsSection = path === Paths.stats.main

  const [currentRecord, setCurrentRecord] = useState<CoreRecord['id'] | null>(
    null,
  )

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
  const [isShowingPronunciation, setShowingPronunciation] = useState(false)
  const [isShowingEdition, setShowingEdition] = useState<boolean>(false)
  const [practiceHasError, setPracticeHasError] = useState<boolean>(false)

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageDefinition['id']>(initialLanguageId)

  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [currentDisplayCharIdx, setCurrentDisplayCharIdx] = useState<number>(0)
  const [writingBorder, setWritingBorder] = useState<'bold' | 'normal'>('bold')
  const [hasExtraControls, setHasExtraControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const writingArea = useRef<HTMLTextAreaElement | null>(null)

  const [displayMobileKeyboard, setDisplayMobileKeyboard] = useState<
    boolean | null
  >(null)

  const [, setDictionaryKey] = useState<number>(0)
  const langOpts = _stories.langOpts ?? languageUIController.getLangOpts()

  const langHandler = languageManager.getCurrentLanguageHandler()

  const { storage } = services

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

  const onDictionaryLoaded = () => {
    setDictionaryKey(k => k + 1)
  }

  const updateLanguage = (lang: LanguageDefinition['id']) => {
    languageManager.setCurrentLanguageHandler(lang)
    setSelectedLanguage(lang)
  }

  useEffect(() => {
    doStatsCheck()
  }, [])

  useEffect(() => {
    if (!hasLoadedStorage) return

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectedLanguage

    const localLanguageUIController =
      languageUIManager.getLanguageUIController()

    localLanguageUIController.loadDictionary().then(onDictionaryLoaded)
  }, [languageUIManager, selectedLanguage, hasLoadedStorage])

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
        setDisplayMobileKeyboard(savedDisplayTonesNum === 'true')
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
    if (displayMobileKeyboard === null) return

    storage.setValue('displayTonesNum', displayMobileKeyboard.toString())
  }, [displayMobileKeyboard, storage])

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

  const trimByChunks = (chunks: number) => {
    setPractice('')
    setWriting('')
    setPracticeHasError(false)

    langOpts.charsWithMistakes = []

    const newFragments: T_Fragments = {
      index: 0,
      list: fragments.list.reduce<string[]>((acc, fragmentText, idx) => {
        if (idx % chunks === 0) {
          acc.push(fragmentText)

          return acc
        }

        const lastFragment = acc[acc.length - 1] || ''
        const lastChar = lastFragment[lastFragment.length - 1] || ''

        const separator =
          !!lastFragment &&
          !['!', '！', '?', '？', '.', '。', '》', '」'].includes(lastChar)
            ? '. '
            : ' '

        const newFragment = `${lastFragment}${separator}${fragmentText}`

        acc[acc.length - 1] = newFragment

        return acc
      }, []),
    }

    setFragments(newFragments)
    storage.setValue('fragments', JSON.stringify(newFragments))
    writingArea.current?.focus()
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

  const specialChars = langHandler?.getSpecialChars()

  const langOptsObj = {
    langOpts: {
      pronunciationInput: pronunciationValue,
      ...((langOpts as unknown as T_LangOpts | undefined) ?? {}),
    },
  }

  const charsToRemove = specialCharsValue.split('').concat(specialChars ?? [])

  const charsObjsList = langHandler?.convertToCharsObjs({
    ...langOptsObj,
    charsToRemove,
    text: originalTextValue,
  })

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice = (
    practiceText = practiceValue,
  ) => {
    if (!langHandler) return null

    const practiceCharsObjs = langHandler.convertToCharsObjs({
      ...langOptsObj,
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
    const valsFns = [setPronunciation, setSpecialChars, setWriting, setPractice]

    valsFns.forEach(fn => {
      fn('')
    })

    const newFragments: T_Fragments = { index: 0, list: [''] }

    languageUIController.處理清除事件?.(languageUIController)
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

  const handleKeyDown = (事件: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    // 允許瀏覽器快捷鍵
    if (事件.ctrlKey || 事件.metaKey) return

    if (事件.key === 'Enter') {
      setPractice(`${practiceValue}\n`)
    }

    languageUIController.handleKeyDown({
      按鍵事件: 事件,
      charsObjsList: charsObjsList ?? [],
      currentText,
      getCurrentCharObjFromPractice,
      langOpts,
      originalTextValue,
      practiceValue,
      selectedLanguage,
      setCurrentDisplayCharIdx,
      setCurrentText,
      setPractice,
      setPracticeHasError,
      setWriting,
      specialCharsValue: charsToRemove.join(''),
      writingValue,
    })

    languageUIController.saveLangOptss(langOpts)
  }

  const updateLangOpts = (選項: T_LangOpts) => {
    languageUIController.saveLangOptss(選項)
    觸發重新渲染(Math.random())
  }

  const LinksBlock = languageUIController.getLinksBlock()
  const OptionsBlock = languageUIController.getOptionsBlock()

  const saveRecord = () => {
    replacePath(Paths.records.save)
  }

  const listRecords = () => {
    replacePath(Paths.records.list)
  }

  if (!hasLoadedStorage) {
    return (
      <div className="flex w-full flex-row items-center justify-center">
        <span className="mt-[48px] animate-spin text-[50px]">
          <CgSpinnerAlt />
        </span>
      </div>
    )
  }

  if (showingAnkis) {
    return (
      <AnkisSection
        charsObjsList={charsObjsList ?? []}
        language={selectedLanguage}
        mode={showingAnkis}
        setMode={mode => {
          replacePath(mode ? ankiModeToPath[mode] : '')
        }}
      />
    )
  }

  if (showingRecordsInitScreen) {
    return (
      <RecordsSection
        initScreen={showingRecordsInitScreen}
        language={selectedLanguage}
        onPronunciationLoad={setPronunciation}
        onRecordLoad={(record: CoreRecord) => {
          clearValues()

          if (record.language !== selectedLanguage) {
            handleLanguageChange(record.language)
          }

          replacePath('')
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
          replacePath('')
        }}
        onSongLoad={lyrics => {
          const newFragments: T_Fragments = {
            index: 0,
            list: lyrics,
          }

          onPracticeSourceChange(newFragments)
          replacePath('')
        }}
        pronunciation={pronunciationValue}
        selectedLanguage={selectedLanguage}
        services={services}
        text={originalTextValue}
      />
    )
  }

  if (showingStatsSection) {
    return (
      <StatsSection
        onClose={() => {
          replacePath('')
        }}
        selectedLanguage={selectedLanguage}
      />
    )
  }

  const colorOfCurrentChar = practiceHasError
    ? languageUIController.getToneColor?.(
        'current-error',
        { ...langOpts, useTonesColors: 'current-error' },
        getCurrentCharObjFromPractice()?.ch ?? null,
      )
    : undefined

  const { mobileKeyboard } = languageUIController

  const progressStr = (() => {
    if (!charsObjsList?.length) return `${t('progressStr', 'Progress')}: 0%`

    return `Progress: ${Math.round(
      (currentDisplayCharIdx / charsObjsList.length) * 100,
    )}% (${currentDisplayCharIdx}/${charsObjsList.length})`
  })()

  return (
    <>
      <div className="flex flex-row flex-wrap gap-[12px]">
        <Button onClick={clearValues}>{t('panel.clear')}</Button>
        <Button
          onClick={() => {
            setHasExtraControls(!hasExtraControls)

            setTimeout(() => {
              writingArea.current?.focus()
            }, 100)
          }}
        >
          {hasExtraControls ? <FaTools /> : <FaToolbox />}
        </Button>
        {hasExtraControls && (
          <Button onClick={listRecords}>{t('panel.recordSongs')}</Button>
        )}
        {hasExtraControls && (
          <Button
            onClick={() => {
              replacePath(Paths.stats.main)
            }}
          >
            {t('panel.stats', 'Stats')}
          </Button>
        )}
        {hasExtraControls && isMobile && (
          <Button
            onClick={() => {
              setDisplayMobileKeyboard(!displayMobileKeyboard)
            }}
          >
            {displayMobileKeyboard
              ? t('panel.hideMobileKeyboard', 'Hide Mobile Keyboard')
              : t('panel.displayMobileKeyboard', 'Display Mobile Keyboard')}
          </Button>
        )}
        {hasExtraControls && isLoggedIn && (
          <Button
            onClick={() => {
              replacePath(ankiModeToPath[AnkisMode.Main])
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
              replacePath(ankiModeToPath[AnkisMode.Main])
            }}
          >
            {t('panel.addAnkis')}
          </Button>
        )}
        {!hasExtraControls && fragments.list.length > 1 && (
          <Button
            onClick={() => {
              trimByChunks(Infinity)
            }}
          >
            {t('panel.trim', 'Trim')}
          </Button>
        )}
        {!hasExtraControls && fragments.list.length > 50 && (
          <Button
            onClick={() => {
              trimByChunks(50)
            }}
          >
            {t('panel.trim50', 'Trim by 50')}
          </Button>
        )}
        {hasExtraControls && (
          <>
            <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
              <Button
                onClick={() => {
                  fileInputRef.current?.click()
                }}
              >
                {t('panel.importFile')}
              </Button>
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
                ref={fileInputRef}
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
            <Button
              onClick={async () => {
                const newText = await getMostFailures(selectedLanguage, 50)

                onPracticeSourceChange({
                  index: 0,
                  list: [newText],
                })
              }}
            >
              {t('panel.mostFailures', 'Most Failures Round')}
            </Button>
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
            <span className="flex items-center">{progressStr}</span>
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
            <TextArea
              onBlur={() => {
                if (languageUIController.onBlur) {
                  const { newFragmentsList } = languageUIController.onBlur({
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
                <TextArea
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
                <TextArea
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
              colorOfChar={(isCurrentChar, ch) =>
                languageUIController.getToneColor?.(
                  (() => {
                    if (isCurrentChar) {
                      if (practiceHasError) {
                        return 'current-error'
                      }

                      return 'current'
                    }

                    return 'other'
                  })(),
                  langOpts,
                  ch,
                )
              }
              fontSize={fontSize}
              hasCantodict={['cantonese', 'mandarin'].includes(
                languageManager.currentLanguageHandlerId as string,
              )}
              onSymbolClick={() => {
                setShowingEdition(false)
                setHasExtraControls(false)
                setShowingPronunciation(false)

                if (!displayMobileKeyboard) {
                  writingArea.current?.focus()
                }
              }}
              應該有不同的寬度={
                !languageUIController.shouldAllCharsHaveSameWidth
              }
              應該隱藏發音={!isShowingPronunciation}
              重點字元索引={currentDisplayCharIdx}
              顯示目前字元的發音={
                practiceHasError &&
                ['還原論者', undefined].includes(
                  langOpts.遊戲模式值 as string | undefined,
                )
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
                } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>

                handleKeyDown(mockEvent)
              }
            }}
            onFocus={() => setWritingBorder('bold')}
            onKeyDown={handleKeyDown}
            placeholder={practiceValue ? '' : t('panel.writingArea')}
            rows={1}
            setRef={ref => (writingArea.current = ref)}
            style={{
              borderWidth: writingBorder === 'bold' ? 2 : 1,
            }}
            value={writingValue}
            無遊標
          />
          <TextArea
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
          {isMobile && mobileKeyboard && (
            <div className="flex w-full flex-col justify-between gap-[24px]">
              {mobileKeyboard.map((row, rowIdx) => {
                // Display first row (numbers) even if the keyboard is hidden
                if (rowIdx !== 0 && !displayMobileKeyboard) return null

                return (
                  <div className="flex flex-row justify-between" key={rowIdx}>
                    {row.map((key, keyIdx) => {
                      const commonProps = {
                        clickEffect: true,
                        style: {
                          padding: '16px',
                        },
                      }

                      return (
                        <Fragment key={key}>
                          <Button
                            onClick={e => {
                              if (!displayMobileKeyboard) {
                                // eslint-disable-next-line
                                ;(e as any).preventDefault()
                                // eslint-disable-next-line
                                ;(e as any).stopPropagation()
                                writingArea.current?.focus()
                              }

                              handleKeyDown({
                                key,
                                preventDefault: () => {},
                              } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>)
                            }}
                            {...commonProps}
                          >
                            {key}
                          </Button>
                          {rowIdx === mobileKeyboard.length - 1 &&
                            keyIdx === row.length - 1 && (
                              <Button
                                onClick={() => {
                                  handleKeyDown({
                                    key: 'Backspace',
                                    preventDefault: () => {},
                                  } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>)
                                }}
                                {...commonProps}
                              >
                                {'<'}
                              </Button>
                            )}
                        </Fragment>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mb-[12px] flex flex-row flex-wrap justify-start gap-[12px]">
        <LinksBlock
          fragments={fragments}
          langHandler={langHandler}
          langOptsObj={langOptsObj}
          updateFragments={setFragments}
          文字={originalTextValue}
        />
      </div>
    </>
  )
}

export default Panel
