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
  useCallback,
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
  Language,
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
  initialText?: string;
  languagesList: LanguagesList;
  onChangeTheme?: () => void;
  onHideRequest?: () => void;
  replacePath: (path: string) => void;
  services: T_Services;
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
  initialText,
  languagesList,
  onChangeTheme,
  onHideRequest,
  replacePath,
  services,
  UI,
}: Props) => {
  const { t } = useTranslation();
  const path = getPath();

  const currentLanguageId = languagesList.get_language_id() as string;
  const languageRef = useRef<Language>();

  const hasLoadedSourceText = useRef<boolean>(false);

  const setCurrentLanguage = useCallback(
    (text: string) => {
      if (!languageRef.current) {
        const newLanguage = languagesList.get_current_language_clone();

        newLanguage?.set_source_text(text);
        languageRef.current = newLanguage;
      }
    },
    [languagesList],
  );

  setCurrentLanguage(initialText ?? '');

  useEffect(() => {
    const currentText = languageRef.current?.get_source_text() ?? '';

    currentLanguageId;

    languageRef.current = undefined;
    setCurrentLanguage(currentText);
  }, [setCurrentLanguage, currentLanguageId]);

  const language = languageRef.current as Language;

  const {
    state: { isLoggedIn },
  } = useMainContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [, rerenderKey] = useState(0);

  const rerender = useCallback(() => {
    rerenderKey((i) => i + 1);
  }, []);

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

  const [pronunciation, setPronunciation] = useState('');

  const writingText = language?.writing_text ?? '';
  const originalTextValue = language?.get_text_to_practice() ?? '';
  const sourceText = language?.get_source_text();
  const fragmentsCount = language?.get_fragments_count();
  const currentFragmentIndex = language?.get_current_fragment_index();

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
    () => getController(currentLanguageId),
    [currentLanguageId],
  );

  const [displayMobileKeyboard, setDisplayMobileKeyboard] = useState<
    boolean | null
  >(null);

  const mobileKeyboard = useMemo((): string[][] | undefined => {
    currentLanguageId;

    if (language) {
      return get_mobile_keyboard(language);
    }
  }, [currentLanguageId, language]);

  const langOpts = controller.getLangOpts();

  const { storage } = services;

  const onPracticeSourceChange = useCallback(
    (newText?: string) => {
      language.clear_practice();

      if (typeof newText !== 'undefined') {
        language.set_source_text(newText);
      }

      rerender();
    },
    [language, rerender],
  );

  useEffect(() => {
    currentFragmentIndex;

    onPracticeSourceChange();
  }, [currentFragmentIndex, sourceText, onPracticeSourceChange]);

  const updateLanguage = (lang: string) => {
    languagesList.set_current_language(lang);
    rerender();
  };

  useEffect(() => {
    void doStatsCheck();
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage || !language) return;

    setHasLoadedDictionary(false);

    void controller
      .loadDictionary()
      .then((dictionary) => {
        if (!dictionary) return;

        set_language_dictionary(language, currentLanguageId, dictionary);
      })
      .finally(() => {
        setHasLoadedDictionary(true);
      });
  }, [hasLoadedStorage, currentLanguageId, language, controller]);

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
      storageSelectedLanguage !== currentLanguageId
    ) {
      updateLanguage(storageSelectedLanguage);
    }

    setHasLoadedStorage(true);
  };

  const prepareForWriting = useCallback(() => {
    setShowingEdition(false);
    setShowingPronunciation(false);
    setHasExtraControls(false);
    writingArea.current?.focus();
  }, []);

  const trimByChunks = (chunks: number) => {
    language?.trim_by_chunks(chunks);

    prepareForWriting();
  };

  useEffect(() => {
    updateLanguageWithStorage().catch(() => {});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (sourceText && hasLoadedSourceText.current) {
      storage.setValue('sourceText', sourceText);
    }
  }, [sourceText, storage]);

  useEffect(() => {
    void (async () => {
      if (!language) return;

      const lastSourceText = await storage.getValue('sourceText');

      if (lastSourceText) {
        language.set_source_text(lastSourceText);
      }

      hasLoadedSourceText.current = true;
    })();
  }, [initialFragmentIndex, storage, language]);

  useEffect(() => {
    language?.set_pronunciation_input(pronunciation || undefined);
  }, [pronunciation, language]);

  const langOptsObj = {
    langOpts: {
      ...((langOpts as unknown as T_LangOpts | undefined) ?? {}),
    },
  };

  const charsObjsList = language?.convert_to_char_objs_original();
  const practiceText = language?.practice_text;

  const keysCombination = [practiceText, sourceText, hasLoadedDictionary].join(
    '_',
  );

  const getCurrentCharObjFromPractice: T_getCurrentCharObjFromPractice =
    useCallback(
      (p = practiceText) => {
        keysCombination;

        return language?.get_current_char_obj(p) ?? null;
      },
      [language, keysCombination, practiceText],
    );

  const currentDisplayCharIdx = useMemo(() => {
    const practiceCharObj = getCurrentCharObjFromPractice();

    pronunciation;

    if (practiceCharObj?.ch && practiceCharObj.ch.pronunciation !== '?') {
      return practiceCharObj.index;
    }

    return null;
  }, [getCurrentCharObjFromPractice, pronunciation]);

  useEffect(() => {
    if (showingAnkis) return;

    const handleShortcuts = (e: KeyboardEvent) => {
      const value = e.key;

      if (value === SHORTCUT_NEXT_FRAGMENT) {
        language.move_fragments(1);
      }
    };

    document.addEventListener('keydown', handleShortcuts);

    return () => {
      document.removeEventListener('keydown', handleShortcuts);
    };
    // eslint-disable-next-line
  }, [isShowingEdition, isShowingPronunciation, showingAnkis]);

  const clearValues = () => {
    controller.handleClearEvent?.(controller);
    storage.setValue('sourceText', '');
    setShowingPronunciation(true);
    setShowingEdition(true);
    setCurrentRecord(null);
    onPracticeSourceChange('');
  };

  const handleLanguageChange = (newSelectedLanguage: string) => {
    storage.setValue(STORAGE_LANGUAGE_KEY, newSelectedLanguage);
    updateLanguage(newSelectedLanguage);
  };

  const handleKeyDown = (事件: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    // 允許瀏覽器快捷鍵
    // @TODO: Move to wasm
    if (事件.ctrlKey || 事件.metaKey) return;

    controller.handleKeyDown({
      按鍵事件: 事件,
      langOpts,
      language,
    });

    controller.saveLangOptss(langOpts);
    rerender();
  };

  const updateLangOpts = (選項: T_LangOpts) => {
    controller.saveLangOptss(選項);
    rerender();
  };

  const LinksBlock = controller.getLinksBlock();
  const OptionsBlock = controller.getOptionsBlock();

  const saveRecord = () => {
    replacePath(Paths.records.save);
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
        language={currentLanguageId}
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
        language={currentLanguageId}
        onPronunciationLoad={(p) => setPronunciation(p || '')}
        onRecordLoad={(record: TextRecordObj) => {
          clearValues();

          if (record.language !== currentLanguageId) {
            handleLanguageChange(record.language);
          }

          replacePath('');
          setShowingEdition(false);
          setShowingPronunciation(false);

          language.set_source_text(record.text);
          setCurrentRecord(record.id);

          setPronunciation(record.pronunciation || '');
        }}
        onRecordsClose={() => {
          replacePath('');
        }}
        onSongLoad={(lyrics) => {
          language.set_source_text(lyrics.join('\n'));
          rerender();
          replacePath('');
        }}
        pronunciation={pronunciation}
        selectedLanguage={currentLanguageId}
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
        selectedLanguage={currentLanguageId}
      />
    );
  }

  const availableLanguages = languagesList
    .get_available_languages()
    .map((lang) => ({
      id: lang,
      name: languageIdToName[lang] ?? lang,
    }));

  const colorOfCurrentChar = language.practice_has_error
    ? controller.getToneColor?.(
        'current-error',
        { ...langOpts, useTonesColors: 'current-error' },
        getCurrentCharObjFromPractice()?.ch ?? null,
      )
    : undefined;

  const progressStr = (() => {
    if (!charsObjsList?.length || typeof currentDisplayCharIdx !== 'number')
      return `${t('progressStr', 'Progress')}: 0%`;

    return `Progress: ${Math.round(
      (currentDisplayCharIdx / charsObjsList.length) * 100,
    )}% (${currentDisplayCharIdx}/${charsObjsList.length})`;
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
          <Button
            onClick={() => {
              replacePath(Paths.records.list);
            }}
          >
            {t('panel.recordSongs')}
          </Button>
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
        {!hasExtraControls && fragmentsCount > 1 && (
          <Button
            onClick={() => {
              trimByChunks(10000);
            }}
          >
            {t('panel.trim', 'Trim')}
          </Button>
        )}
        {!hasExtraControls && fragmentsCount > 50 && (
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
                    const fileContent = await file.text();

                    language.set_source_text_from_subtitles(fileContent);

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
                const newText = await getMostFailures(currentLanguageId, 50);

                onPracticeSourceChange(newText);
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
              selectedLanguage={currentLanguageId}
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
        {fragmentsCount > 1 && (
          <Button
            onClick={() => {
              language.move_fragments(1);
              rerender();
            }}
          >
            {t('panel.currentFragment')}: {currentFragmentIndex + 1} /{' '}
            {fragmentsCount}
          </Button>
        )}
        {fragmentsCount > 5 && (
          <Button
            onClick={() => {
              language.move_fragments(-1);
              rerender();
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
                prepareForWriting();
              }}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                onPracticeSourceChange(e.target.value);
              }}
              placeholder={t('panel.sourceText')}
              rows={3}
              value={sourceText}
            />
            {hasExtraControls && (
              <>
                <TextArea
                  onChange={createInputSetterFn((v: string) =>
                    setPronunciation(v),
                  )}
                  placeholder={t('panel.pronunciation')}
                  rows={2}
                  value={pronunciation}
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
              重點字元索引={currentDisplayCharIdx}
              應該有不同的寬度={!controller.shouldAllCharsHaveSameWidth}
              顯示目前字元的發音={
                language.practice_has_error &&
                [gameModes?.reductive, undefined].includes(
                  langOpts.gameModeValue as string | undefined,
                )
              }
              charsObjsList={charsObjsList ?? []}
              colorOfChar={(isCurrentChar, ch) =>
                controller.getToneColor?.(
                  (() => {
                    if (isCurrentChar) {
                      if (language.practice_has_error) {
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
              hasCantodict={['cantonese', 'mandarin'].includes(
                currentLanguageId,
              )}
              onSymbolClick={() => {
                prepareForWriting();
              }}
              shouldHidePronunciation={!isShowingPronunciation}
            />
          </div>
          <TextArea
            無遊標
            autoFocus
            onBlur={() => setWritingBorder('normal')}
            onChange={(e) => {
              const diff = e.target.value.length - writingText.length;

              // Simulate the keydown event again to support mobile web
              if (diff === 1) {
                const mockEvent = {
                  key: e.target.value.slice(-1),
                  preventDefault: () => {},
                } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>;

                handleKeyDown(mockEvent);

                rerender();
              }
            }}
            onFocus={() => setWritingBorder('bold')}
            onKeyDown={handleKeyDown}
            placeholder={practiceText ? '' : t('panel.writingArea')}
            rows={1}
            setRef={(ref) => (writingArea.current = ref)}
            style={{
              borderWidth: writingBorder === 'bold' ? 2 : 1,
            }}
            value={writingText}
          />
          <TextArea
            autoScroll
            onChange={() => {}}
            onFocus={() => {
              writingArea.current?.focus();
            }}
            placeholder=""
            rows={3}
            style={{
              border: `4px solid ${
                language.practice_has_error
                  ? (colorOfCurrentChar ?? 'red')
                  : 'var(--color-background, "white")'
              }`,
              fontSize,
              lineHeight: `${fontSize + 10}px`,
              maxHeight: isMobile ? '100px' : undefined,
            }}
            value={practiceText ?? ''}
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
          langOptsObj={langOptsObj}
          language={language}
          rerender={rerender}
          updateLangOpts={updateLangOpts}
        />
      </div>
    </>
  );
};

export default Panel;
