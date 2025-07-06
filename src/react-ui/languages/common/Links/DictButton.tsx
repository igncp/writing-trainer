import TextInput from '#/react-ui/components/TextInput/TextInput';
import { useMainContext } from '#/react-ui/containers/main-context';
import { DictResponse } from '#/react-ui/graphql/graphql';
import { backendClient } from '#/react-ui/lib/backendClient';
import { useIsMobile } from '#/react-ui/lib/hooks';
import { TOOLTIP_ID } from '#/utils/tooltip';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { LanguagesUI } from 'writing-trainer-wasm/writing_trainer_wasm';

import Button, { T_ButtonProps } from '../../../components/button/button';

export type DictResponseState = [DictResponse, string] | null;

export const useDictState = () => {
  const [dictResponse, setDictResponse] = useState<DictResponseState>(null);

  return {
    dictResponse,
    setDictResponse,
  };
};

type CombinationItem = {
  meaning: string;
  pronunciation: string;
  word: string;
};

type ClickItem = Record<keyof CombinationItem, null | number>;

const REVERSE_STORAGE_KEY = 'dict-reverse';

const shuffleArray = <A,>(array: A[]): A[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const CLICKED_STYLE = 'border-l-[2px] border-[#0c0] cursor-pointer pl-[8px]';
const NUM_STYLE = 'mr-[12px] rounded-[24px] bg-[#555] px-[8px] py-[4px]';

type Props = {
  language: string;
  setDictResponse: (dictResponse: [DictResponse, string] | null) => void;
  text: string;
} & Omit<T_ButtonProps, 'children'>;

export const DictButton = ({
  language,
  setDictResponse,
  text,
  ...rest
}: Props) => {
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

type ShuffleData = {
  combinations: CombinationItem[];
  correct: number;
  currentClick: ClickItem;
  jumps: number;
  lastResult: 'correct' | 'wrong' | null;
  meaningFilter: string;
  meanings: string[];
  pronunciationFilter: string;
  pronunciations: string[];
  words: string[];
  wrong: number;
  wrongWords: Set<string>;
};

export const DictContent = ({
  dictResponse,
  languagesUI,
  setDictResponse,
  text,
}: {
  dictResponse: DictResponseState;
  languagesUI: LanguagesUI | null;
  setDictResponse: (dictResponse: [DictResponse, string] | null) => void;
  text: string;
}) => {
  const isMobile = useIsMobile();
  const [displayedItems, setDisplayedItems] = useState(new Set<number>());
  const [displayOneWord, setDisplayOneWord] = useState(false);
  const [displayPronunciation, setDisplayPronunciation] = useState(false);
  const [extraFilterCheck, setExtraFilterCheck] = useState(true);

  const [isReverse, setIsReverse] = useState(
    typeof window !== 'undefined'
      ? window.localStorage.getItem(REVERSE_STORAGE_KEY) === 'true'
      : false,
  );

  const meaningFilterRef = useRef<HTMLInputElement>(null);
  const pronunciationFilterRef = useRef<HTMLInputElement>(null);

  const [shuffleData, setShuffleData] = useState<null | ShuffleData>(null);

  const { t } = useTranslation();

  const getPronunciation = useCallback(
    (txt: string) => languagesUI?.get_filtered_pronunciation(txt, undefined),
    [languagesUI],
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

  const getInitDataForWords = useCallback(
    (wordsList: Set<string>): ShuffleData => {
      if (!dictResponse) throw new Error('dictResponse is null');

      const combinations: CombinationItem[] = dictResponse[0].words
        .map((dict) => {
          const { meaning, word } = dict;

          if (!wordsList.has(word)) {
            return null;
          }

          if (!displayOneWord && word.length === 1) {
            return null;
          }

          const pronunciation = getPronunciation(word);

          return { meaning, pronunciation, word };
        })
        .filter(Boolean) as CombinationItem[];

      const words = combinations.map((c) => c.word);
      const meanings = combinations.map((c) => c.meaning);
      const pronunciations = combinations.map((c) => c.pronunciation);

      shuffleArray(words);
      shuffleArray(meanings);
      shuffleArray(pronunciations);

      const currentClick = isReverse
        ? { meaning: 0, pronunciation: null, word: null }
        : {
            meaning: null,
            pronunciation: null,
            word: 0,
          };

      return {
        combinations,
        correct: 0,
        currentClick,
        jumps: 0,
        lastResult: null,
        meaningFilter: '',
        meanings,
        pronunciationFilter: '',
        pronunciations,
        words,
        wrong: 0,
        wrongWords: new Set(),
      };
    },
    [displayOneWord, dictResponse, getPronunciation, isReverse],
  );

  useEffect(() => {
    if (!shuffleData) return;

    const { currentClick } = shuffleData;

    if (
      currentClick.word !== null &&
      currentClick.meaning !== null &&
      (!displayPronunciation || currentClick.pronunciation !== null)
    ) {
      const clickedWord =
        shuffleData.words[shuffleData.currentClick.word as number];

      const clickedMeaning =
        shuffleData.meanings[shuffleData.currentClick.meaning as number];

      const clickedPronunciation =
        shuffleData.pronunciations[
          shuffleData.currentClick.pronunciation as number
        ];

      const clickedCombination = shuffleData.combinations.findIndex(
        (combination) =>
          combination.word === clickedWord &&
          combination.meaning === clickedMeaning &&
          (!displayPronunciation ||
            combination.pronunciation === clickedPronunciation),
      );

      const newShuffleData: ShuffleData = {
        ...shuffleData,
        currentClick: isReverse
          ? {
              meaning: 0,
              pronunciation: null,
              word: null,
            }
          : {
              meaning: null,
              pronunciation: null,
              word: 0,
            },
        meaningFilter: '',
        pronunciationFilter: '',
      };

      // This assumes that `clickedCombination` exists and that `meaningFilter`
      // is not empty. It checks that at least 2 full words in the filter match
      // the clicked meaning (or 1 if it's a single word).
      const getIsCorrectFilter = () => {
        if (isReverse || !extraFilterCheck) return true;

        const meaningWords = new Set(
          clickedMeaning
            .replace(/[^a-zA-Z'-]/g, ' ')
            .split(' ')
            .map((w) => w.trim().toLowerCase())
            .filter(Boolean)
            .filter((c) => !/^[-]*$/.test(c)),
        );

        if (!meaningWords.size) return true;

        const filterWords = new Set(
          shuffleData.meaningFilter
            .split(' ')
            .map((w) => w.trim().toLowerCase())
            .filter(Boolean),
        );

        const sameWords = Array.from(meaningWords).filter((w) =>
          filterWords.has(w),
        );

        return sameWords.length > (meaningWords.size > 1 ? 1 : 0);
      };

      if (clickedCombination !== -1 && getIsCorrectFilter()) {
        newShuffleData.correct += 1;

        const wordsIndex = newShuffleData.words.findIndex(
          (w) => w === clickedWord,
        );

        const pronunciationIndex = newShuffleData.pronunciations.findIndex(
          (p) => p === clickedPronunciation,
        );

        const meningIndex = newShuffleData.meanings.findIndex(
          (m) => m === clickedMeaning,
        );

        newShuffleData.words = newShuffleData.words.filter(
          (_, i) => i !== wordsIndex,
        );

        newShuffleData.pronunciations = newShuffleData.pronunciations.filter(
          (_, i) => i !== pronunciationIndex,
        );

        newShuffleData.meanings = newShuffleData.meanings.filter(
          (_, i) => i !== meningIndex,
        );

        newShuffleData.combinations = newShuffleData.combinations.filter(
          (_, i) => i !== clickedCombination,
        );

        if (newShuffleData.words.length === 0) {
          if (newShuffleData.wrongWords.size > 0) {
            const newData = getInitDataForWords(newShuffleData.wrongWords);

            setShuffleData(newData);
          } else {
            setShuffleData(null);
          }

          return;
        }

        newShuffleData.lastResult = 'correct';

        if (isReverse) {
          newShuffleData.currentClick.meaning = 0;
        } else {
          newShuffleData.currentClick.word = 0;
        }
      } else {
        newShuffleData.wrong += 1;

        const newWrongWords = new Set(newShuffleData.wrongWords);

        newWrongWords.add(clickedWord);

        newShuffleData.lastResult = 'wrong';
        newShuffleData.wrongWords = newWrongWords;
      }

      if (displayPronunciation) {
        pronunciationFilterRef.current?.focus();
      } else {
        meaningFilterRef.current?.focus();
      }

      setShuffleData(newShuffleData);
    }
  }, [
    shuffleData,
    displayPronunciation,
    getInitDataForWords,
    isReverse,
    extraFilterCheck,
  ]);

  if (!dictResponse?.[1]) {
    return null;
  }

  const filterMatches = (filterText: string, fullText: string) =>
    filterText
      .split(' ')
      .filter(Boolean)
      .every((word) =>
        (fullText || '').toLowerCase().includes(word.toLowerCase()),
      );

  return (
    <div className="flex w-[100%] flex-col gap-[16px]">
      <div className="flex flex-row flex-wrap gap-[12px]">
        {!shuffleData && (
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
            if (shuffleData ?? !dictResponse) {
              setShuffleData(null);

              return;
            }

            const wordsList = new Set(dictResponse[0].words.map((w) => w.word));

            const initData = getInitDataForWords(wordsList);

            setShuffleData(initData);
          }}
        >
          {shuffleData
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
        {shuffleData && (
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
      {shuffleData ? (
        <div>
          [(R) {shuffleData.combinations.length} /{' '}
          <span
            className={shuffleData.lastResult === 'correct' ? 'font-bold' : ''}
          >
            (G)
          </span>{' '}
          {shuffleData.correct} /{' '}
          <span
            className={shuffleData.lastResult === 'wrong' ? 'font-bold' : ''}
          >
            (B)
          </span>{' '}
          {shuffleData.wrong} / (T){' '}
          {shuffleData.correct + shuffleData.combinations.length} / (J){' '}
          {shuffleData.jumps}]
        </div>
      ) : (
        <div>
          {t('dict.total')}: {dictResponse[0].words.length}
        </div>
      )}
      {dictResponse[1] === text &&
        (() => {
          if (shuffleData) {
            const onMeaningClicked = (index: number) => {
              const isMeaningClicked =
                shuffleData.currentClick.meaning === index;

              const newShuffleData = {
                ...shuffleData,
              };

              newShuffleData.currentClick = {
                ...shuffleData.currentClick,
                meaning: isMeaningClicked ? null : index,
              };

              setShuffleData(newShuffleData);
            };

            const onWordClicked = (index: number) => {
              const isWordClicked = shuffleData.currentClick.word === index;

              const newShuffleData = {
                ...shuffleData,
                meaningFilter: '',
              };

              newShuffleData.currentClick = {
                ...shuffleData.currentClick,
                word: isWordClicked ? null : index,
              };

              setShuffleData(newShuffleData);
            };

            const onPronunciationClicked = (index: number) => {
              const isPronunciationClicked =
                shuffleData.currentClick.pronunciation === index;

              const newShuffleData = {
                ...shuffleData,
                pronunciationFilter: '',
              };

              newShuffleData.currentClick = {
                ...shuffleData.currentClick,
                pronunciation: isPronunciationClicked ? null : index,
              };

              meaningFilterRef.current?.focus();

              setShuffleData(newShuffleData);
            };

            const filteredData = shuffleData.combinations
              .map((_, i) => {
                const meaning = shuffleData.meanings[i];
                const pronunciation = shuffleData.pronunciations[i];
                const word = shuffleData.words[i];

                const pronunciationForWord = shuffleData.combinations.find(
                  (c) => c.word === word,
                )?.pronunciation;

                if (
                  !!shuffleData.meaningFilter &&
                  (isReverse
                    ? !filterMatches(
                        shuffleData.meaningFilter,
                        pronunciationForWord ?? '',
                      )
                    : !filterMatches(shuffleData.meaningFilter, meaning))
                ) {
                  return null;
                }

                if (
                  displayPronunciation &&
                  !!shuffleData.pronunciationFilter &&
                  !filterMatches(shuffleData.pronunciationFilter, pronunciation)
                ) {
                  return null;
                }

                return i;
              })
              .filter((i): i is number => typeof i === 'number');

            const clickedWord =
              typeof shuffleData.currentClick.word === 'number'
                ? shuffleData.words[shuffleData.currentClick.word]
                : null;

            const clickedMeaning =
              typeof shuffleData.currentClick.meaning === 'number'
                ? shuffleData.meanings[shuffleData.currentClick.meaning]
                : null;

            const clickedPronunciation =
              typeof shuffleData.currentClick.pronunciation === 'number' &&
              displayPronunciation
                ? shuffleData.pronunciations[
                    shuffleData.currentClick.pronunciation
                  ]
                : null;

            const handleTab = (shiftKey: boolean) => {
              const newShuffleData = {
                ...shuffleData,
                jumps: shuffleData.jumps + 1,
              };

              if (isReverse) {
                const newMeanings = shuffleData.meanings.slice();

                if (shiftKey) {
                  const lastMeaning = newMeanings.pop();

                  newMeanings.unshift(lastMeaning as string);
                } else {
                  const firstMeaning = newMeanings.shift();

                  newMeanings.push(firstMeaning as string);
                }

                newShuffleData.meanings = newMeanings;
              } else {
                const newWords = shuffleData.words.slice();

                if (shiftKey) {
                  const lastWord = newWords.pop();

                  newWords.unshift(lastWord as string);
                } else {
                  const firstWord = newWords.shift();

                  newWords.push(firstWord as string);
                }

                newShuffleData.words = newWords;
              }

              setShuffleData(newShuffleData);
            };

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
                        const newShuffleData = {
                          ...shuffleData,
                        };

                        newShuffleData.pronunciationFilter = e.target.value;

                        setShuffleData(newShuffleData);
                      }}
                      onKeyDown={(e) => {
                        const numKeys = Array.from({ length: 5 }).map((_, i) =>
                          String(i + 1),
                        );

                        if (numKeys.includes(e.key)) {
                          e.preventDefault();
                          e.stopPropagation();

                          const numKey = Number(e.key) - 1;

                          if (typeof filteredData[numKey] === 'number') {
                            const pronunciation =
                              shuffleData.pronunciations[filteredData[numKey]];

                            const index = shuffleData.pronunciations.findIndex(
                              (m) => pronunciation === m,
                            );

                            onPronunciationClicked(index);
                          }
                        } else if (e.key === 'Escape') {
                          e.stopPropagation();
                          e.preventDefault();

                          setShuffleData({
                            ...shuffleData,
                            pronunciationFilter: '',
                          });
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          if (
                            !filteredData.length ||
                            !shuffleData.pronunciationFilter
                          )
                            return;

                          const pronunciation =
                            shuffleData.pronunciations[filteredData[0]];

                          const index = shuffleData.pronunciations.findIndex(
                            (p) => p === pronunciation,
                          );

                          onPronunciationClicked(index);
                        } else if (e.key === 'Tab') {
                          e.stopPropagation();
                          e.preventDefault();
                          handleTab(e.shiftKey);
                        } else if (!isMobile && e.key === 'Backspace') {
                          e.stopPropagation();
                          e.preventDefault();

                          if (!shuffleData.pronunciationFilter) {
                            return;
                          }

                          setShuffleData({
                            ...shuffleData,
                            pronunciationFilter: '',
                          });
                        }
                      }}
                      placeholder={t(
                        'pronunciationFilter',
                        'Pronunciation Filter',
                      )}
                      value={shuffleData.pronunciationFilter}
                    />
                  )}
                  <TextInput
                    inputRef={meaningFilterRef}
                    onChange={(e) => {
                      const newShuffleData = {
                        ...shuffleData,
                      };

                      newShuffleData.meaningFilter = e.target.value;

                      setShuffleData(newShuffleData);
                    }}
                    onKeyDown={(e) => {
                      const numKeys = Array.from({ length: 5 }).map((_, i) =>
                        String(i + 1),
                      );

                      if (numKeys.includes(e.key)) {
                        e.preventDefault();
                        e.stopPropagation();

                        const numKey = Number(e.key) - 1;

                        if (typeof filteredData[numKey] === 'number') {
                          const meaning =
                            shuffleData.meanings[filteredData[numKey]];

                          const index = shuffleData.meanings.findIndex(
                            (m) => meaning === m,
                          );

                          onMeaningClicked(index);
                        }
                      } else if (e.key === 'Escape') {
                        e.stopPropagation();
                        e.preventDefault();

                        setShuffleData({
                          ...shuffleData,
                          meaningFilter: '',
                        });
                      }
                    }}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        if (!filteredData.length || !shuffleData.meaningFilter)
                          return;

                        if (isReverse) {
                          const word = shuffleData.words[filteredData[0]];

                          const index = shuffleData.words.findIndex(
                            (m) => word === m,
                          );

                          onWordClicked(index);
                        } else {
                          const meaning = shuffleData.meanings[filteredData[0]];

                          const index = shuffleData.meanings.findIndex(
                            (m) => meaning === m,
                          );

                          onMeaningClicked(index);
                        }
                      } else if (e.key === 'Tab') {
                        e.stopPropagation();
                        e.preventDefault();
                        handleTab(e.shiftKey);
                      } else if (!isMobile && e.key === 'Backspace') {
                        e.stopPropagation();
                        e.preventDefault();

                        if (!shuffleData.meaningFilter) return;

                        setShuffleData({
                          ...shuffleData,
                          meaningFilter: '',
                        });
                      }
                    }}
                    placeholder={
                      isReverse
                        ? t('wordFilter', 'Word Filter')
                        : t('meaningFilter', 'Meaning Filter')
                    }
                    value={shuffleData.meaningFilter}
                  />
                  {isMobile && (
                    <span
                      className="ml-[8px] text-[14px] underline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTab(false);

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
                {filteredData.map((i, idx) => {
                  const word = shuffleData.words[i];
                  const meaning = shuffleData.meanings[i];
                  const pronunciation = shuffleData.pronunciations[i];

                  const isWordClicked = shuffleData.currentClick.word === i;

                  const isMeaningClicked =
                    shuffleData.currentClick.meaning === i;

                  const isPronunciationClicked =
                    shuffleData.currentClick.pronunciation === i;

                  const wordEl = (
                    <div
                      className={[
                        isWordClicked &&
                        !shuffleData.meaningFilter &&
                        !shuffleData.pronunciationFilter
                          ? CLICKED_STYLE
                          : '',
                        isMobile
                          ? 'w-[50px] min-w-[50px] text-[20px]'
                          : 'w-[200px] min-w-[200px] text-[40px]',
                      ].join(' ')}
                      onClick={() => {
                        if (
                          shuffleData.meaningFilter ||
                          shuffleData.pronunciationFilter
                        ) {
                          return;
                        }

                        const newShuffleData = {
                          ...shuffleData,
                        };

                        newShuffleData.currentClick = {
                          ...shuffleData.currentClick,
                          word: isWordClicked ? null : i,
                        };

                        if (displayPronunciation) {
                          pronunciationFilterRef.current?.focus();
                        } else {
                          meaningFilterRef.current?.focus();
                        }

                        setShuffleData(newShuffleData);
                      }}
                    >
                      {!isReverse &&
                      (shuffleData.meaningFilter ||
                        shuffleData.pronunciationFilter)
                        ? '-'
                        : word}
                    </div>
                  );

                  return (
                    <div
                      className="flex min-w-[500px] flex-row items-center justify-start gap-[10px] border-b-[1px] border-[#ccc] py-[10px] text-[22px]"
                      key={i}
                    >
                      {!isReverse && wordEl}
                      {displayPronunciation && (
                        <div
                          className={[
                            isPronunciationClicked ? CLICKED_STYLE : '',
                            'font-italic w-[200px] min-w-[200px] cursor-pointer font-bold',
                          ].join(' ')}
                          onClick={() => onPronunciationClicked(i)}
                        >
                          {(() => {
                            if (shuffleData.meaningFilter) return '-';

                            return (
                              <span>
                                {shuffleData.pronunciationFilter ? (
                                  <span className={NUM_STYLE}>{idx + 1}</span>
                                ) : null}
                                <span>{pronunciation}</span>
                              </span>
                            );
                          })()}
                        </div>
                      )}
                      <div
                        className={[
                          isMeaningClicked ? CLICKED_STYLE : '',
                          'cursor-pointer',
                          isReverse ? 'flex-1' : '',
                        ].join(' ')}
                        onClick={() => onMeaningClicked(i)}
                      >
                        {(() => {
                          if (
                            (isReverse && shuffleData.meaningFilter) ||
                            shuffleData.pronunciationFilter
                          )
                            return '-';

                          return (
                            <span>
                              {shuffleData.meaningFilter ? (
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
                })}
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
