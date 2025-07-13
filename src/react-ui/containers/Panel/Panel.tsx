import { getController } from '#/react-ui/languages';
import {
  doStatsCheck,
  getMostFailures,
} from '#/react-ui/languages/common/stats';
import { useIsMobile } from '#/react-ui/lib/hooks';
import { Paths } from '#/react-ui/lib/paths';
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { CgSpinnerAlt } from 'react-icons/cg';
import { FaToolbox, FaTools } from 'react-icons/fa';
import {
  get_mobile_keyboard,
  LanguagesList,
  set_language_dictionary,
  TextRecordObj,
} from 'writing-trainer-wasm/writing_trainer_wasm';

import Button from '../../components/button/button';
import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay';
import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage';
import TextArea from '../../components/TextArea/TextArea';
import {
  gameModes,
  PanelState,
  T_Fragments,
  T_getCurrentCharObjFromPractice,
  T_LangOpts,
} from '../../languages/types';
import { T_Services } from '../../typings/mainTypes';
import {
  ankiModeToPath,
  AnkisMode,
  AnkisSection,
} from '../AnkisSection/AnkisSection';
import LoginWidget from '../LoginWidget/LoginWidget';
import { useMainContext } from '../main-context';
import RecordsSection, {
  recordsModeToPath,
  RecordsScreen,
} from '../RecordsSection/RecordsSection';
import { StatsSection } from '../StatsSection/StatsSection';

const STORAGE_LANGUAGE_KEY = 'selectedLanguage';

const createInputSetterFn =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (setValue: any) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

const SHORTCUT_NEXT_FRAGMENT = 'Tab';
const defaultFontSize = 30;

type Props = {
  getPath: () => string;
  initialFragmentIndex?: number;
  languagesList: LanguagesList;
  onChangeTheme?: () => void;
  onHideRequest?: () => void;
  replacePath: (path: string) => void;
  services: T_Services;
  text: string;
  UI?: {
    noHideButton?: boolean;
  };
};

const languageIdToName: Record<string, string> = {
  cantonese: '粤语',
  english: 'English',
  japanese: '日本語',
  mandarin: '普通话',
};

const Panel = ({
  getPath,
  initialFragmentIndex,
  languagesList,
  onChangeTheme,
  onHideRequest,
  replacePath,
  services,
  text,
  UI,
}: Props) => {
  const { t } = useTranslation();
  const path = getPath();
  const [, rerender] = useState(0);

  const currentLanguage = languagesList.get_language_id() as string;

  const {
    state: { isLoggedIn },
  } = useMainContext();

  const [, 觸發重新渲染] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fragments, setFragments] = useState<T_Fragments>({
    index: 0,
    list: [text],
  });

  const showingAnkis = (Object.entries(ankiModeToPath).find(
    ([, value]) => value === path,
  )?.[0] ?? null) as AnkisMode | null;

  const showingRecordsInitScreen = (Object.entries(recordsModeToPath).find(
    ([, value]) => value === path,
  )?.[0] ?? null) as null | RecordsScreen;

  const showingStatsSection = path === Paths.stats.main;

  const [currentRecord, setCurrentRecord] = useState<
    null | TextRecordObj['id']
  >(null);

  const [panel, setPanel] = useState<PanelState>({
    currentDisplayCharIdx: 0,
    override: '',
    practice: '',
    practiceError: false,
    pronunciation: '',
    writing: '',
  });

  const originalTextValue = panel.override || fragments.list[fragments.index];

  languagesList.set_practice(panel.practice);
  languagesList.set_original(originalTextValue);
  languagesList.set_writing(panel.writing);
  languagesList.set_override_text(panel.override);
  languagesList.set_practice_has_error(panel.practiceError);

  const [fontSize, setFontSize] = useState<number>(defaultFontSize);
  const [isShowingPronunciation, setShowingPronunciation] = useState(false);
  const [isShowingEdition, setShowingEdition] = useState<boolean>(false);

  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false);

  const [hasLoadedDictionary, setHasLoadedDictionary] =
    useState<boolean>(false);

  const [writingBorder, setWritingBorder] = useState<'bold' | 'normal'>('bold');
  const [hasExtraControls, setHasExtraControls] = useState(false);
  const writingArea = useRef<HTMLTextAreaElement | null>(null);
  const isMobile = useIsMobile();

  const controller = useMemo(
    () => getController(currentLanguage),
    [currentLanguage],
  );

  const [displayMobileKeyboard, setDisplayMobileKeyboard] = useState<
    boolean | null
  >(null);

  const mobileKeyboard = useMemo((): string[][] | undefined => {
    // @typescript-eslint/no-unused-expressions
    currentLanguage;

    return get_mobile_keyboard(languagesList);
  }, [currentLanguage, languagesList]);

  const langOpts = controller.getLangOpts();

  const { storage } = services;

  const onPracticeSourceChange = (newFragments?: T_Fragments) => {
    setPanel((s) => ({
      ...s,
      currentDisplayCharIdx: 0,
      override: '',
      practice: '',
      practiceError: false,
      writing: '',
    }));

    if (newFragments) {
      setFragments(newFragments);
      storage.setValue('fragments', JSON.stringify(newFragments));
    }
  };

  const handleOriginalTextUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    const list = val
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newFragments: T_Fragments = {
      index: 0,
      list: list.length ? list : [''],
    };

    onPracticeSourceChange(newFragments);
  };

  const updateLanguage = (lang: string) => {
    languagesList.set_current_language(lang);
    rerender((i) => i + 1);
  };

  useEffect(() => {
    void doStatsCheck();
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;

    setHasLoadedDictionary(false);

    void controller
      .loadDictionary()
      .then((dictionary) => {
        if (!dictionary) return;

        set_language_dictionary(languagesList, currentLanguage, dictionary);
      })
      .finally(() => {
        setHasLoadedDictionary(true);
      });
  }, [hasLoadedStorage, currentLanguage, languagesList, controller]);

  useEffect(() => {
    // eslint-disable-next-line
    (async () => {
      const savedFontSize = await storage.getValue('fontSize');
      const savedDisplayTonesNum = await storage.getValue('displayTonesNum');

      if (savedFontSize) {
        const parsedFontSize = Number(savedFontSize);

        if (parsedFontSize) {
          setFontSize(parsedFontSize);
        }
      }

      if (savedDisplayTonesNum) {
        setDisplayMobileKeyboard(savedDisplayTonesNum === 'true');
      }
    })();
  }, [storage]);

  useEffect(() => {
    if (fontSize !== defaultFontSize) {
      storage.setValue('fontSize', fontSize.toString());
    } else {
      storage.setValue('fontSize', '');
    }
  }, [fontSize, storage]);

  useEffect(() => {
    if (displayMobileKeyboard === null) return;

    storage.setValue('displayTonesNum', displayMobileKeyboard.toString());
  }, [displayMobileKeyboard, storage]);

  const updateLanguageWithStorage = async () => {
    const storageSelectedLanguage =
      await storage.getValue(STORAGE_LANGUAGE_KEY);

    if (
      storageSelectedLanguage &&
      storageSelectedLanguage !== currentLanguage
    ) {
      updateLanguage(storageSelectedLanguage);
    }

    setHasLoadedStorage(true);
  };

  const trimByChunks = (chunks: number) => {
    setPanel({
      ...panel,
      practice: '',
      practiceError: false,
      writing: '',
    });

    const newFragments: T_Fragments = {
      index: 0,
      list: fragments.list.reduce<string[]>((acc, fragmentText, idx) => {
        if (idx % chunks === 0) {
          acc.push(fragmentText);

          return acc;
        }

        const lastFragment = acc[acc.length - 1] || '';
        const lastChar = lastFragment[lastFragment.length - 1] || '';

        const separator =
          !!lastFragment &&
          // @TODO: Move this to wasm
          !['!', '！', '?', '？', '.', '。', '》', '」'].includes(lastChar)
            ? '. '
            : ' ';

        const newFragment = `${lastFragment}${separator}${fragmentText}`;

        acc[acc.length - 1] = newFragment;

        return acc;
      }, []),
    };

    setFragments(newFragments);
    storage.setValue('fragments', JSON.stringify(newFragments));
    writingArea.current?.focus();
  };

  useEffect(() => {
    updateLanguageWithStorage().catch(() => {});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    (async () => {
      const lastFragments = await storage.getValue('fragments');

      if (lastFragments) {
        const parsedFragments = JSON.parse(lastFragments);

        setFragments({
          ...parsedFragments,
          ...(initialFragmentIndex !== undefined && {
            index: initialFragmentIndex,
          }),
        });
      }
    })();
  }, [initialFragmentIndex, storage]);

  useEffect(() => {
    languagesList.set_pronunciation_input(panel.pronunciation || undefined);
  }, [panel.pronunciation, languagesList]);

  const langOptsObj = {
    langOpts: {
      ...((langOpts as unknown as T_LangOpts | undefined) ?? {}),
    },
  };

  const charsObjsList = languagesList.convert_to_char_objs_original();

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice = (
    practiceText = panel.practice,
  ) => languagesList.get_current_char_obj(practiceText) ?? null;

  useEffect(() => {
    const practiceCharObj = getCurrentCharObjFromPractice();

    if (practiceCharObj?.ch && practiceCharObj.ch.pronunciation !== '?') {
      setPanel((s) => ({
        ...s,
        currentDisplayCharIdx: practiceCharObj.index,
      }));
    }
    // eslint-disable-next-line
  }, [panel.practice, panel.pronunciation]);

  useEffect(() => {
    if (showingAnkis) return;

    const handleShortcuts = (e: KeyboardEvent) => {
      const value = e.key;

      if (value === SHORTCUT_NEXT_FRAGMENT) {
        e.preventDefault();

        const newFragments: T_Fragments = {
          ...fragments,
          index: (fragments.index + 1) % fragments.list.length,
        };

        onPracticeSourceChange(newFragments);
      }
    };

    document.addEventListener('keydown', handleShortcuts);

    return () => {
      document.removeEventListener('keydown', handleShortcuts);
    };
    // eslint-disable-next-line
  }, [isShowingEdition, isShowingPronunciation, fragments, showingAnkis]);

  const clearValues = () => {
    setPanel((s) => ({
      ...s,
      practice: '',
      pronunciation: '',
      writing: '',
    }));

    const newFragments: T_Fragments = { index: 0, list: [''] };

    controller.handleClearEvent?.(controller);
    storage.setValue('fragments', JSON.stringify(newFragments));
    setShowingPronunciation(true);
    setShowingEdition(true);
    setCurrentRecord(null);
    onPracticeSourceChange(newFragments);
  };

  const handleLanguageChange = (newSelectedLanguage: string) => {
    storage.setValue(STORAGE_LANGUAGE_KEY, newSelectedLanguage);
    updateLanguage(newSelectedLanguage);
  };

  const handleKeyDown = (事件: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    // 允許瀏覽器快捷鍵
    if (事件.ctrlKey || 事件.metaKey) return;

    controller.handleKeyDown({
      按鍵事件: 事件,
      langOpts,
      languagesList,
      setPanel,
    });

    controller.saveLangOptss(langOpts);
  };

  const updateLangOpts = (選項: T_LangOpts) => {
    controller.saveLangOptss(選項);
    觸發重新渲染(Math.random());
  };

  const LinksBlock = controller.getLinksBlock();
  const OptionsBlock = controller.getOptionsBlock();

  const saveRecord = () => {
    replacePath(Paths.records.save);
  };

  const listRecords = () => {
    replacePath(Paths.records.list);
  };

  if (!hasLoadedStorage || !hasLoadedDictionary) {
    return (
      <div className="flex w-full flex-row items-center justify-center">
        <span className="mt-[48px] animate-spin text-[50px]">
          <CgSpinnerAlt />
        </span>
      </div>
    );
  }

  if (showingAnkis) {
    return (
      <AnkisSection
        charsObjsList={charsObjsList ?? []}
        language={currentLanguage}
        mode={showingAnkis}
        setMode={(mode) => {
          replacePath(mode ? ankiModeToPath[mode] : '');
        }}
      />
    );
  }

  if (showingRecordsInitScreen) {
    return (
      <RecordsSection
        initScreen={showingRecordsInitScreen}
        language={currentLanguage}
        onPronunciationLoad={(p) =>
          setPanel((s) => ({ ...s, pronunciation: p }))
        }
        onRecordLoad={(record: TextRecordObj) => {
          clearValues();

          if (record.language !== currentLanguage) {
            handleLanguageChange(record.language);
          }

          replacePath('');
          setShowingEdition(false);
          setShowingPronunciation(false);

          const newFragments: T_Fragments = {
            index: 0,
            list: record.text.split('\n'),
          };

          onPracticeSourceChange(newFragments);
          setCurrentRecord(record.id);

          setPanel((s) => ({
            ...s,
            pronunciation: record.pronunciation,
          }));
        }}
        onRecordsClose={() => {
          replacePath('');
        }}
        onSongLoad={(lyrics) => {
          const newFragments: T_Fragments = {
            index: 0,
            list: lyrics,
          };

          onPracticeSourceChange(newFragments);
          replacePath('');
        }}
        pronunciation={panel.pronunciation}
        selectedLanguage={currentLanguage}
        services={services}
        text={originalTextValue}
      />
    );
  }

  if (showingStatsSection) {
    return (
      <StatsSection
        onClose={() => {
          replacePath('');
        }}
        selectedLanguage={currentLanguage}
      />
    );
  }

  const availableLanguages = languagesList
    .get_available_languages()
    .map((lang) => ({
      id: lang,
      name: languageIdToName[lang] ?? lang,
    }));

  const colorOfCurrentChar = panel.practiceError
    ? controller.getToneColor?.(
        'current-error',
        { ...langOpts, useTonesColors: 'current-error' },
        getCurrentCharObjFromPractice()?.ch ?? null,
      )
    : undefined;

  const progressStr = (() => {
    if (!charsObjsList?.length) return `${t('progressStr', 'Progress')}: 0%`;

    return `Progress: ${Math.round(
      (panel.currentDisplayCharIdx / charsObjsList.length) * 100,
    )}% (${panel.currentDisplayCharIdx}/${charsObjsList.length})`;
  })();

  if (!hasLoadedStorage) return null;

  return (
    <>
      <div className="flex flex-row flex-wrap gap-[12px]">
        <Button onClick={clearValues}>{t('panel.clear')}</Button>
        <Button
          onClick={() => {
            setHasExtraControls(!hasExtraControls);

            setTimeout(() => {
              writingArea.current?.focus();
            }, 100);
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
              replacePath(Paths.stats.main);
            }}
          >
            {t('panel.stats', 'Stats')}
          </Button>
        )}
        {hasExtraControls && isMobile && (
          <Button
            onClick={() => {
              setDisplayMobileKeyboard(!displayMobileKeyboard);
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
              replacePath(ankiModeToPath[AnkisMode.Main]);
            }}
          >
            {t('panel.openAnki')}
          </Button>
        )}
        <Button
          onClick={() => {
            void navigator.clipboard.writeText(originalTextValue);
          }}
        >
          {t('panel.copy')}
        </Button>
        {isLoggedIn && !hasExtraControls && (
          <Button
            onClick={() => {
              replacePath(ankiModeToPath[AnkisMode.Main]);
            }}
          >
            {t('panel.addAnkis')}
          </Button>
        )}
        {!hasExtraControls && fragments.list.length > 1 && (
          <Button
            onClick={() => {
              trimByChunks(Infinity);
            }}
          >
            {t('panel.trim', 'Trim')}
          </Button>
        )}
        {!hasExtraControls && fragments.list.length > 50 && (
          <Button
            onClick={() => {
              trimByChunks(50);
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
                  fileInputRef.current?.click();
                }}
              >
                {t('panel.importFile')}
              </Button>
              <input
                id="file-input"
                onChange={() => {
                  const fileEl = document.getElementById(
                    'file-input',
                  ) as HTMLInputElement | null;

                  if (!fileEl) return;

                  const file = fileEl.files?.[0];

                  if (!file) {
                    return;
                  }

                  void (async () => {
                    let fileContent = await file.text();

                    // @TODO: Move this to wasm
                    if (
                      ['.srt', '.vtt'].find((ext) => file.name.endsWith(ext))
                    ) {
                      fileContent = fileContent
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(
                          (line) =>
                            !!line &&
                            !line.includes('-->') &&
                            !/^[0-9]*$/.test(line),
                        )
                        .join('\n');
                    }

                    const newFragments: T_Fragments = {
                      index: 0,
                      list: fileContent.split('\n'),
                    };

                    onPracticeSourceChange(newFragments);
                    setShowingEdition(false);
                    setShowingPronunciation(false);
                  })();
                }}
                ref={fileInputRef}
                style={{ display: 'none' }}
                type="file"
              />
            </label>
            <Button
              onClick={() => {
                setShowingPronunciation(!isShowingPronunciation);
                writingArea.current?.focus();
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
                const newText = await getMostFailures(currentLanguage, 50);

                onPracticeSourceChange({
                  index: 0,
                  list: [newText],
                });
              }}
            >
              {t('panel.mostFailures', 'Most Failures Round')}
            </Button>
            <LoginWidget />
            <Button
              onClick={() => {
                setShowingEdition(!isShowingEdition);
                writingArea.current?.focus();
              }}
            >
              {t('panel.toggleEdition')}
            </Button>
            <ChooseLanguage
              languages={availableLanguages}
              onOptionsChange={handleLanguageChange}
              selectedLanguage={currentLanguage}
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
              };

              onPracticeSourceChange(newFragments);
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
              };

              onPracticeSourceChange(newFragments);
            }}
          >
            {t('panel.previousFragment')}
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
                const { onBlur } = controller;

                if (onBlur) {
                  const { newFragmentsList } = onBlur({
                    fragmentsList: fragments.list,
                    langOpts,
                  });

                  if (newFragmentsList) {
                    const newFragments = {
                      ...fragments,
                      list: newFragmentsList,
                    };

                    onPracticeSourceChange(newFragments);
                  }
                }

                setShowingEdition(false);
                setShowingPronunciation(false);
                writingArea.current?.focus();
              }}
              onChange={handleOriginalTextUpdate}
              placeholder={t('panel.sourceText')}
              rows={3}
              value={fragments.list.join('\n')}
            />
            {hasExtraControls && (
              <>
                <TextArea
                  onChange={createInputSetterFn((v: string) =>
                    setPanel((s) => ({ ...s, pronunciation: v })),
                  )}
                  placeholder={t('panel.pronunciation')}
                  rows={2}
                  value={panel.pronunciation}
                />
                {OptionsBlock && (
                  <OptionsBlock
                    langOpts={langOpts}
                    updateLangOpts={updateLangOpts}
                  />
                )}
                <div style={{ fontSize: '12px' }}>
                  {t('panel.charSize')}:{' '}
                  <input
                    onChange={(event) => {
                      setFontSize(Number(event.target.value));
                    }}
                    type="number"
                    value={fontSize}
                  />
                </div>
              </>
            )}
            {/* This is necessary because the options block initialises some values*/}
            <div style={{ display: 'none' }}>
              {OptionsBlock && (
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
              重點字元索引={panel.currentDisplayCharIdx}
              應該有不同的寬度={!controller.shouldAllCharsHaveSameWidth}
              顯示目前字元的發音={
                panel.practiceError &&
                [gameModes?.reductive, undefined].includes(
                  langOpts.gameModeValue as string | undefined,
                )
              }
              charsObjsList={charsObjsList ?? []}
              colorOfChar={(isCurrentChar, ch) =>
                controller.getToneColor?.(
                  (() => {
                    if (isCurrentChar) {
                      if (panel.practiceError) {
                        return 'current-error';
                      }

                      return 'current';
                    }

                    return 'other';
                  })(),
                  langOpts,
                  ch,
                )
              }
              fontSize={fontSize}
              hasCantodict={['cantonese', 'mandarin'].includes(currentLanguage)}
              onSymbolClick={() => {
                setShowingEdition(false);
                setHasExtraControls(false);
                setShowingPronunciation(false);

                if (!displayMobileKeyboard) {
                  writingArea.current?.focus();
                }
              }}
              shouldHidePronunciation={!isShowingPronunciation}
            />
          </div>
          <TextArea
            無遊標
            autoFocus
            onBlur={() => setWritingBorder('normal')}
            onChange={(e) => {
              const diff = e.target.value.length - panel.writing.length;

              setPanel((s) => ({
                ...s,
                writing: e.target.value,
              }));

              // Simulate the keydown event again to support mobile web
              if (diff === 1) {
                const mockEvent = {
                  key: e.target.value.slice(-1),
                  preventDefault: () => {},
                } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>;

                handleKeyDown(mockEvent);
              }
            }}
            onFocus={() => setWritingBorder('bold')}
            onKeyDown={handleKeyDown}
            placeholder={panel.practice ? '' : t('panel.writingArea')}
            rows={1}
            setRef={(ref) => (writingArea.current = ref)}
            style={{
              borderWidth: writingBorder === 'bold' ? 2 : 1,
            }}
            value={panel.writing}
          />
          <TextArea
            自動捲動
            onChange={createInputSetterFn((v: string) => {
              setPanel((s) => ({
                ...s,
                practice: v,
              }));
            })}
            onFocus={() => {
              writingArea.current?.focus();
            }}
            placeholder=""
            rows={3}
            style={{
              border: `4px solid ${
                panel.practiceError
                  ? (colorOfCurrentChar ?? 'red')
                  : 'var(--color-background, "white")'
              }`,
              fontSize,
              lineHeight: `${fontSize + 10}px`,
              maxHeight: isMobile ? '100px' : undefined,
            }}
            value={panel.practice}
          />
          {isMobile && mobileKeyboard && (
            <div className="flex w-full flex-col justify-between gap-[24px]">
              {mobileKeyboard.map((row, rowIdx) => {
                // Display first row (numbers) even if the keyboard is hidden
                if (rowIdx !== 0 && !displayMobileKeyboard) return null;

                return (
                  <div className="flex flex-row justify-between" key={rowIdx}>
                    {row.map((key, keyIdx) => {
                      const commonProps = {
                        clickEffect: true,
                        style: {
                          padding: '16px',
                        },
                      };

                      return (
                        <Fragment key={key}>
                          <Button
                            onClick={(e) => {
                              if (!displayMobileKeyboard) {
                                // eslint-disable-next-line
                                (e as any).preventDefault();
                                // eslint-disable-next-line
                                (e as any).stopPropagation();
                                writingArea.current?.focus();
                              }

                              handleKeyDown({
                                key,
                                preventDefault: () => {},
                              } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>);
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
                                  } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>);
                                }}
                                {...commonProps}
                              >
                                {'<'}
                              </Button>
                            )}
                        </Fragment>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mb-[12px] flex flex-row flex-wrap justify-start gap-[12px]">
        <LinksBlock
          文字={originalTextValue}
          focusWritingArea={() => {
            writingArea.current?.focus();
          }}
          fragments={fragments}
          langOptsObj={langOptsObj}
          languagesList={languagesList}
          updateFragments={setFragments}
          updateLangOpts={updateLangOpts}
        />
      </div>
    </>
  );
};

export default Panel;
