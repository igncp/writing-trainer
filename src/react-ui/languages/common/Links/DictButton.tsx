import TextInput from '#/react-ui/components/TextInput/TextInput';
import { useMainContext } from '#/react-ui/containers/main-context';
import { DictResponse } from '#/react-ui/graphql/graphql';
import { backendClient } from '#/react-ui/lib/backendClient';
import { useIsMobile } from '#/react-ui/lib/hooks';
import { TOOLTIP_ID } from '#/utils/tooltip';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import {
  ActionOnEvaluate,
  Language,
  OnEvaluate,
  ShuffleState,
} from 'writing-trainer-wasm/writing_trainer_wasm';

import Button, { T_ButtonProps } from '../../../components/button/button';

type DictResponseState = [DictResponse, string] | null;

const useDictState = () => {
  const [dictResponse, setDictResponse] = useState<DictResponseState>(null);

  return {
    dictResponse,
    setDictResponse,
  };
};

const REVERSE_STORAGE_KEY = 'dict-reverse';

const CLICKED_STYLE = 'border-l-[2px] border-[#0c0] cursor-pointer pl-[8px]';
const NUM_STYLE = 'mr-[12px] rounded-[24px] bg-[#555] px-[8px] py-[4px]';

type Props = {
  language: string;
  setDictResponse: (dictResponse: [DictResponse, string] | null) => void;
  text: string;
} & Omit<T_ButtonProps, 'children'>;

const DictButton = ({ language, setDictResponse, text, ...rest }: Props) => {
  const { t } = useTranslation();
  const mainContext = useMainContext();

  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = mainContext.state;
  const canUseDict = process.env.NODE_ENV !== 'production' || isLoggedIn;

  return (
    <Button
      data-tooltip-content={canUseDict ? '' : t('option.needLoggedIn')}
      data-tooltip-id={TOOLTIP_ID}
      disabled={!canUseDict || isLoading}
      onClick={() => {
        setIsLoading(true);

        void backendClient
          .useDict(text, language)
          .then((_translation) => {
            setDictResponse([_translation, text]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }}
      {...rest}
    >
      <span className="inline-flex flex-row items-center gap-[4px]">
        <span>{t('option.useDict')}</span>
        <span
          className={['animate-spin', isLoading ? 'block' : 'hidden'].join(' ')}
        >
          <FaSpinner color="#0f0" />
        </span>
      </span>
    </Button>
  );
};

const DictContent = ({
  dictResponse,
  language,
  setDictResponse,
  text,
}: {
  dictResponse: DictResponseState;
  language: Language | null;
  setDictResponse: (dictResponse: [DictResponse, string] | null) => void;
  text: string;
}) => {
  const isMobile = useIsMobile();
  const [displayedItems, setDisplayedItems] = useState(new Set<number>());
  const [displayOneWord, setDisplayOneWord] = useState(false);
  const [displayPronunciation, setDisplayPronunciation] = useState(false);
  const [extraFilterCheck, setExtraFilterCheck] = useState(true);
  const [, rerenderBase] = useState(0);
  const rerender = useCallback(() => rerenderBase((v) => v + 1), []);

  const [isReverse, setIsReverse] = useState(
    typeof window !== 'undefined'
      ? window.localStorage.getItem(REVERSE_STORAGE_KEY) === 'true'
      : false,
  );

  const meaningFilterRef = useRef<HTMLInputElement>(null);
  const pronunciationFilterRef = useRef<HTMLInputElement>(null);

  const shuffleStateRef = useRef<null | ShuffleState>(null);
  const shuffleState = shuffleStateRef.current;

  if (shuffleState) {
    shuffleState.set_display_pronunciation(displayPronunciation);
    shuffleState.set_reverse(isReverse);
    shuffleState.set_extra_filter_check(extraFilterCheck);
    shuffleState.set_display_one_word(displayOneWord);
    shuffleState.set_is_mobile(isMobile);
  }

  const { t } = useTranslation();

  const getPronunciation = useCallback(
    (txt: string) => language?.get_filtered_pronunciation(txt, undefined),
    [language],
  );

  useEffect(() => {
    window.localStorage.setItem(REVERSE_STORAGE_KEY, isReverse.toString());
  }, [isReverse]);

  useEffect(() => {
    if (text) {
      setDictResponse(null);
      setDisplayedItems(new Set());
      setDisplayOneWord(false);
    }
  }, [text, setDictResponse]);

  const allWords = useMemo(
    () => dictResponse?.[0].words.map((w) => w.word) ?? [],
    [dictResponse],
  );

  const allMeanings = useMemo(
    () => dictResponse?.[0].words.map((w) => w.meaning) ?? [],
    [dictResponse],
  );

  const setInitDataForWords = useCallback(
    (wordsList: Set<string>) => {
      if (!wordsList.size) {
        shuffleStateRef.current = null;
        rerender();

        return;
      }

      if (!language) throw new Error('language is null');

      shuffleStateRef.current = new ShuffleState(
        language,
        Array.from(wordsList),
        isReverse,
        allWords,
        allMeanings,
        displayOneWord,
        extraFilterCheck,
      );

      rerender();
    },
    [
      displayOneWord,
      allWords,
      allMeanings,
      isReverse,
      rerender,
      language,
      extraFilterCheck,
    ],
  );

  const handleEvaluateResult = useCallback(
    (
      result?: OnEvaluate,
      event?: { preventDefault: () => void; stopPropagation: () => void },
    ) => {
      if (!result) return;

      if (result.prevent_events) {
        event?.preventDefault();
        event?.stopPropagation();
      }

      if (result.action === ActionOnEvaluate.FocusMeaning)
        meaningFilterRef.current?.focus();
      else if (result.action === ActionOnEvaluate.FocusPronunciation)
        pronunciationFilterRef.current?.focus();

      if (result.is_game_end) shuffleStateRef.current = null;

      if (result.rerender) rerender();
    },
    [rerender],
  );

  useEffect(() => {
    if (!language || !shuffleState) return;

    handleEvaluateResult(shuffleState.on_change());
  }, [
    displayPronunciation,
    isReverse,
    extraFilterCheck,
    handleEvaluateResult,
    language,
    shuffleState,
  ]);

  if (!dictResponse?.[1]) {
    return null;
  }

  const shuffleStats = shuffleState?.get_stats();
  const pronunciationFilter = shuffleState?.pronunciation_filter;
  const meaningFilter = shuffleState?.meaning_filter;

  return (
    <div className="flex w-[100%] flex-col gap-[16px]">
      <div className="flex flex-row flex-wrap gap-[12px]">
        {!shuffleState && (
          <>
            <Button
              onClick={() => {
                setDisplayedItems(
                  new Set(
                    Array.from(
                      { length: dictResponse[0].words.length },
                      (_, i) => i,
                    ),
                  ),
                );
              }}
            >
              {t('dict.showAll')}
            </Button>
            <Button
              onClick={() => {
                setDisplayedItems(new Set());
              }}
            >
              {t('dict.hideAll')}
            </Button>
            <Button
              onClick={() => {
                setIsReverse(!isReverse);
              }}
            >
              {t('dict.reverse', 'Reverse')}
            </Button>
            <Button
              onClick={() => {
                setDisplayOneWord(!displayOneWord);
              }}
            >
              {displayOneWord
                ? t('dict.hideOneWord')
                : t('dict.displayOneWord')}
            </Button>
            <Button
              onClick={() => {
                setDisplayPronunciation(!displayPronunciation);
              }}
            >
              {displayPronunciation
                ? t('dict.hidePronunciation', 'Hide pronunciation')
                : t('dict.displayPronunciation', 'Display pronunciation')}
            </Button>
          </>
        )}
        <Button
          onClick={() => {
            if (shuffleState ?? !dictResponse) {
              shuffleStateRef.current = null;
              rerender();

              return;
            }

            const wordsList = new Set(allWords);

            setInitDataForWords(wordsList);
          }}
        >
          {shuffleState
            ? t('dict.closeShuffle', 'Close Shuffle')
            : t('dict.startShuffle', 'Start Shuffle')}
        </Button>
        <Button
          onClick={() => {
            setDictResponse(null);
          }}
        >
          {t('dict.clear')}
        </Button>
        {shuffleState && (
          <Button
            onClick={() => {
              setExtraFilterCheck(!extraFilterCheck);
            }}
          >
            {extraFilterCheck
              ? t('dict.extraFilterCheckNo', 'Remove Filter Check')
              : t('dict.extraFilterCheckYes', 'Add Filter Check')}
          </Button>
        )}
      </div>
      {shuffleStats ? (
        <div>
          [(R) {shuffleStats.combinations} /{' '}
          <span
            className={shuffleStats.last_result === true ? 'font-bold' : ''}
          >
            (G)
          </span>{' '}
          {shuffleStats.correct} /{' '}
          <span
            className={shuffleStats.last_result === false ? 'font-bold' : ''}
          >
            (B)
          </span>{' '}
          {shuffleStats.wrong} / (T){' '}
          {shuffleStats.correct + shuffleStats.combinations} / (J){' '}
          {shuffleStats.jumps}]
        </div>
      ) : (
        <div>
          {t('dict.total')}: {dictResponse[0].words.length}
        </div>
      )}
      {dictResponse[1] === text &&
        (() => {
          if (shuffleState) {
            const {
              meaning: clickedMeaning,
              pronunciation: clickedPronunciation,
              word: clickedWord,
            } = shuffleState.get_clicked_data();

            return (
              <div className="h-[500px] min-h-[500px] max-w-[100%] overflow-auto whitespace-pre-line rounded-[12px] border-[2px] border-[#ccc] p-[10px]">
                <div>
                  {clickedWord && (
                    <span className="mr-[8px] text-[30px]">{clickedWord}</span>
                  )}
                  {clickedPronunciation && (
                    <span className="ml-[4px]">{clickedPronunciation}</span>
                  )}
                  {isReverse && clickedMeaning && (
                    <span className="ml-[4px]">{clickedMeaning}</span>
                  )}
                  {displayPronunciation && (
                    <TextInput
                      inputRef={pronunciationFilterRef}
                      onChange={(e) => {
                        shuffleState.on_pronunciation_change(e.target.value);
                        rerender();
                      }}
                      onKeyDown={(e) => {
                        shuffleState.on_pronunciation_key_down(e.key);
                      }}
                      onKeyUp={(e) => {
                        shuffleState.on_pronunciation_key_up(e.key, e.shiftKey);
                      }}
                      placeholder={t(
                        'pronunciationFilter',
                        'Pronunciation Filter',
                      )}
                      value={pronunciationFilter}
                    />
                  )}
                  <TextInput
                    inputRef={meaningFilterRef}
                    onChange={(e) => {
                      shuffleState.on_meaning_change(e.target.value);
                      rerender();
                    }}
                    onKeyDown={(e) => {
                      handleEvaluateResult(
                        shuffleState.on_meaning_key_down(e.key),
                        e,
                      );
                    }}
                    onKeyUp={(e) => {
                      handleEvaluateResult(
                        shuffleState.on_meaning_key_up(e.key, e.shiftKey),
                        e,
                      );
                    }}
                    placeholder={
                      isReverse
                        ? t('wordFilter', 'Word Filter')
                        : t('meaningFilter', 'Meaning Filter')
                    }
                    value={meaningFilter}
                  />
                  {isMobile && (
                    <span
                      className="ml-[8px] text-[14px] underline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        shuffleState.handle_tab_word(false);

                        if (displayPronunciation) {
                          pronunciationFilterRef.current?.focus();
                        } else {
                          meaningFilterRef.current?.focus();
                        }
                      }}
                    >
                      {t('dict.nextWord', 'Next word')}
                    </span>
                  )}
                </div>
                {shuffleState
                  .get_filtered_rows()
                  .map(
                    (
                      {
                        is_meaning_clicked,
                        is_pronunciation_clicked,
                        is_word_clicked,
                        meaning,
                        pronunciation,
                        word,
                      },
                      idx,
                    ) => {
                      const wordEl = (
                        <div
                          className={[
                            is_word_clicked &&
                            !meaningFilter &&
                            !pronunciationFilter
                              ? CLICKED_STYLE
                              : '',
                            isMobile
                              ? 'w-[50px] min-w-[50px] text-[20px]'
                              : 'w-[200px] min-w-[200px] text-[40px]',
                          ].join(' ')}
                          onClick={(e) => {
                            handleEvaluateResult(
                              shuffleState.on_word_click(word),
                              e,
                            );
                          }}
                        >
                          {!isReverse && (meaningFilter || pronunciationFilter)
                            ? '-'
                            : word}
                        </div>
                      );

                      return (
                        <div
                          className="flex min-w-[500px] flex-row items-center justify-start gap-[10px] border-b-[1px] border-[#ccc] py-[10px] text-[22px]"
                          key={idx}
                        >
                          {!isReverse && wordEl}
                          {displayPronunciation && (
                            <div
                              className={[
                                is_pronunciation_clicked ? CLICKED_STYLE : '',
                                'font-italic w-[200px] min-w-[200px] cursor-pointer font-bold',
                              ].join(' ')}
                              onClick={(e) => {
                                handleEvaluateResult(
                                  shuffleState.on_pronunciation_click(
                                    pronunciation,
                                  ),
                                  e,
                                );
                              }}
                            >
                              {(() => {
                                if (meaningFilter) return '-';

                                return (
                                  <span>
                                    {shuffleState.pronunciation_filter ? (
                                      <span className={NUM_STYLE}>
                                        {idx + 1}
                                      </span>
                                    ) : null}
                                    <span>{pronunciation}</span>
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                          <div
                            className={[
                              is_meaning_clicked ? CLICKED_STYLE : '',
                              'cursor-pointer',
                              isReverse ? 'flex-1' : '',
                            ].join(' ')}
                            onClick={(e) => {
                              handleEvaluateResult(
                                shuffleState.on_meaning_click(meaning),
                                e,
                              );
                            }}
                          >
                            {(() => {
                              if (
                                (isReverse && shuffleState.meaning_filter) ||
                                shuffleState.pronunciation_filter
                              )
                                return '-';

                              return (
                                <span>
                                  {shuffleState.meaning_filter ? (
                                    <span className={NUM_STYLE}>{idx + 1}</span>
                                  ) : null}
                                  <span>{meaning}</span>
                                </span>
                              );
                            })()}
                          </div>
                          {isReverse && wordEl}
                        </div>
                      );
                    },
                  )}
              </div>
            );
          }

          return (
            <div className="mb-[24px] flex h-[400px] w-[100%] flex-col gap-[12px] overflow-auto whitespace-pre-line rounded-[12px] border-[2px] border-[#ccc] p-[10px]">
              {dictResponse[0].words.map((dict, i) => {
                if (!displayOneWord && dict.word.length === 1) {
                  return null;
                }

                return (
                  <div className="flex flex-row gap-[10px]" key={i}>
                    <div className="flex flex-col items-center justify-center">
                      <RxCross2
                        className="cursor-pointer"
                        onClick={() => {
                          const allDisplayed =
                            Array.from(displayedItems).length ===
                            dictResponse[0].words.length;

                          const newDisplayedItems = new Set(displayedItems);

                          if (!allDisplayed) {
                            newDisplayedItems.delete(i);
                          }

                          setDisplayedItems(
                            new Set(
                              Array.from(newDisplayedItems).map((j) =>
                                j > i ? j - 1 : j,
                              ),
                            ),
                          );

                          setDictResponse(
                            dictResponse[0].words.length === 1
                              ? null
                              : [
                                  {
                                    words: dictResponse[0].words.filter(
                                      (_, j) => j !== i,
                                    ),
                                  },
                                  text,
                                ],
                          );
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      ({i + 1})
                    </div>
                    <div
                      className={[
                        'cursor-pointer break-keep border-b-[1px] border-[#ccc]',
                        isReverse ? 'flex items-center' : 'text-[30px]',
                      ].join(' ')}
                      onClick={() => {
                        if (displayedItems.has(i)) {
                          displayedItems.delete(i);
                          setDisplayedItems(new Set(displayedItems));
                        } else {
                          displayedItems.add(i);
                          setDisplayedItems(new Set(displayedItems));
                        }
                      }}
                    >
                      {isReverse ? dict.meaning : dict.word}
                    </div>
                    {displayedItems.has(i) &&
                      (() => {
                        const pronunciation = (() => {
                          const item = dictResponse[0].words[i];

                          if (!item.word) return '';

                          return getPronunciation(item.word);
                        })();

                        return (
                          <div
                            className={[
                              'pt-[10px]',
                              isReverse ? 'text-[30px]' : '',
                            ].join(' ')}
                          >
                            {displayPronunciation ? (
                              <i className="mr-[4px] font-bold">
                                [{pronunciation}]
                              </i>
                            ) : (
                              ''
                            )}
                            {isReverse ? dict.word : dict.meaning}
                          </div>
                        );
                      })()}
                  </div>
                );
              })}
            </div>
          );
        })()}
    </div>
  );
};

export { DictButton, DictContent, useDictState };
