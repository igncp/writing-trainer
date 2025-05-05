import { LanguageHandler } from '#/core'
import TextInput from '#/react-ui/components/TextInput/TextInput'
import { useMainContext } from '#/react-ui/containers/main-context'
import { DictResponse } from '#/react-ui/graphql/graphql'
import { backendClient } from '#/react-ui/lib/backendClient'
import { TOOLTIP_ID } from '#/utils/tooltip'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaSpinner } from 'react-icons/fa'
import { RxCross2 } from 'react-icons/rx'

import Button, { T_ButtonProps } from '../../../components/button/button'

export type DictResponseState = [DictResponse, string] | null

export const useDictState = () => {
  const [dictResponse, setDictResponse] = useState<DictResponseState>(null)

  return {
    dictResponse,
    setDictResponse,
  }
}

type CombinationItem = {
  meaning: string
  pronunciation: string
  word: string
}

type ClickItem = Record<keyof CombinationItem, null | number>

const shuffleArray = <A,>(array: A[]): A[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

const CLICKED_STYLE = 'text-[#afebaf] font-bold'

type Props = {
  language: string
  setDictResponse: (dictResponse: [DictResponse, string] | null) => void
  text: string
} & Omit<T_ButtonProps, 'children'>

export const DictButton = ({
  language,
  setDictResponse,
  text,
  ...rest
}: Props) => {
  const { t } = useTranslation()
  const mainContext = useMainContext()

  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn } = mainContext.state
  const canUseDict = process.env.NODE_ENV !== 'production' || isLoggedIn

  return (
    <Button
      data-tooltip-content={canUseDict ? '' : t('option.needLoggedIn')}
      data-tooltip-id={TOOLTIP_ID}
      disabled={!canUseDict || isLoading}
      onClick={() => {
        setIsLoading(true)

        backendClient
          .useDict(text, language)
          .then(_translation => {
            setDictResponse([_translation, text])
          })
          .finally(() => {
            setIsLoading(false)
          })
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
  )
}

type ShuffleData = {
  combinations: CombinationItem[]
  correct: number
  currentClick: ClickItem
  meaningFilter: string
  meanings: string[]
  pronunciationFilter: string
  pronunciations: string[]
  words: string[]
  wrong: number
}

export const DictContent = ({
  dictResponse,
  langHandler,
  langOptsObj,
  setDictResponse,
  text,
}: {
  dictResponse: DictResponseState
  langHandler: LanguageHandler | null
  langOptsObj: Record<string, unknown>
  setDictResponse: (dictResponse: [DictResponse, string] | null) => void
  text: string
}) => {
  const [displayedItems, setDisplayedItems] = useState(new Set<number>())
  const [displayOneWord, setDisplayOneWord] = useState(false)
  const [displayPronunciation, setDisplayPronunciation] = useState(false)

  const meaningFilterRef = useRef<HTMLInputElement>(null)
  const pronunciationFilterRef = useRef<HTMLInputElement>(null)

  const [shuffleData, setShuffleData] = useState<null | ShuffleData>(null)

  const { t } = useTranslation()

  const getPronunciation = (word: string) => {
    const charsObjsList = langHandler?.convertToCharsObjs({
      ...langOptsObj,
      charsToRemove: [],
      text: word,
    })

    if (!charsObjsList) return ''

    return charsObjsList
      .map(c => c.pronunciation)
      .filter(Boolean)
      .join(' ')
  }

  useEffect(() => {
    if (text) {
      setDictResponse(null)
      setDisplayedItems(new Set())
      setDisplayOneWord(false)
    }
  }, [text, setDictResponse])

  useEffect(() => {
    if (!shuffleData) return

    const { currentClick } = shuffleData

    if (
      currentClick.word !== null &&
      currentClick.meaning !== null &&
      (!displayPronunciation || currentClick.pronunciation !== null)
    ) {
      const clickedWord =
        shuffleData.words[shuffleData.currentClick.word as number]

      const clickedMeaning =
        shuffleData.meanings[shuffleData.currentClick.meaning as number]

      const clickedPronunciation =
        shuffleData.pronunciations[
          shuffleData.currentClick.pronunciation as number
        ]

      const clickedCombination = shuffleData.combinations.findIndex(
        combination =>
          combination.word === clickedWord &&
          combination.meaning === clickedMeaning &&
          (!displayPronunciation ||
            combination.pronunciation === clickedPronunciation),
      )

      const newShuffleData: ShuffleData = {
        ...shuffleData,
        currentClick: {
          meaning: null,
          pronunciation: null,
          word: 0,
        },
        meaningFilter: '',
        pronunciationFilter: '',
      }

      if (clickedCombination !== -1) {
        newShuffleData.correct += 1

        newShuffleData.words = newShuffleData.words.filter(
          w => w !== clickedWord,
        )

        newShuffleData.pronunciations = newShuffleData.pronunciations.filter(
          w => w !== clickedPronunciation,
        )

        newShuffleData.meanings = newShuffleData.meanings.filter(
          w => w !== clickedMeaning,
        )

        newShuffleData.combinations = newShuffleData.combinations.filter(
          (_, i) => i !== clickedCombination,
        )

        if (newShuffleData.words.length === 0) {
          setShuffleData(null)

          return
        }

        newShuffleData.currentClick.word = 0
      } else {
        newShuffleData.wrong += 1

        const [firstWord, ...restWords] = newShuffleData.words

        shuffleData.words = restWords.concat([firstWord])
      }

      if (displayPronunciation) {
        pronunciationFilterRef.current?.focus()
      } else {
        meaningFilterRef.current?.focus()
      }

      setShuffleData(newShuffleData)
    }
  }, [shuffleData, displayPronunciation])

  if (!dictResponse?.[1]) {
    return null
  }

  const filterMatches = (filterText: string, fullText: string) =>
    filterText
      .split(' ')
      .every(word => fullText.toLowerCase().includes(word.toLowerCase()))

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
                )
              }}
            >
              {t('dict.showAll')}
            </Button>
            <Button
              onClick={() => {
                setDisplayedItems(new Set())
              }}
            >
              {t('dict.hideAll')}
            </Button>
            <Button
              onClick={() => {
                setDisplayOneWord(!displayOneWord)
              }}
            >
              {displayOneWord
                ? t('dict.hideOneWord')
                : t('dict.displayOneWord')}
            </Button>
            <Button
              onClick={() => {
                setDisplayPronunciation(!displayPronunciation)
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
              setShuffleData(null)

              return
            }

            const combinations: CombinationItem[] = dictResponse[0].words
              .map(dict => {
                const { meaning, word } = dict

                if (!displayOneWord && word.length === 1) {
                  return null
                }

                const pronunciation = getPronunciation(word)

                return { meaning, pronunciation, word }
              })
              .filter(Boolean) as CombinationItem[]

            const words = combinations.map(c => c.word)
            const meanings = combinations.map(c => c.meaning)
            const pronunciations = combinations.map(c => c.pronunciation)

            shuffleArray(words)
            shuffleArray(meanings)
            shuffleArray(pronunciations)

            const currentClick = {
              meaning: null,
              pronunciation: null,
              word: 0,
            }

            setShuffleData({
              combinations,
              correct: 0,
              currentClick,
              meaningFilter: '',
              meanings,
              pronunciationFilter: '',
              pronunciations,
              words,
              wrong: 0,
            })
          }}
        >
          {shuffleData
            ? t('dict.closeShuffle', 'Close Shuffle')
            : t('dict.startShuffle', 'Start Shuffle')}
        </Button>
        <Button
          onClick={() => {
            setDictResponse(null)
          }}
        >
          {t('dict.clear')}
        </Button>
      </div>
      {shuffleData ? (
        <div>
          {t('dict.remaining', 'Remaining')}: {shuffleData.combinations.length}{' '}
          - {t('dict.correct', 'Correct')}: {shuffleData.correct} -{' '}
          {t('dict.wrong', 'Wrong')}: {shuffleData.wrong} - {t('dict.total')}:{' '}
          {shuffleData.correct + shuffleData.combinations.length}
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
                shuffleData.currentClick.meaning === index

              const newShuffleData = {
                ...shuffleData,
                meaningFilter: '',
              }

              newShuffleData.currentClick = {
                ...shuffleData.currentClick,
                meaning: isMeaningClicked ? null : index,
              }

              setShuffleData(newShuffleData)
            }

            const onPronunciationClicked = (index: number) => {
              const isPronunciationClicked =
                shuffleData.currentClick.pronunciation === index

              const newShuffleData = {
                ...shuffleData,
                pronunciationFilter: '',
              }

              newShuffleData.currentClick = {
                ...shuffleData.currentClick,
                pronunciation: isPronunciationClicked ? null : index,
              }

              meaningFilterRef.current?.focus()

              setShuffleData(newShuffleData)
            }

            const filteredData = shuffleData.combinations
              .map((_, i) => {
                const meaning = shuffleData.meanings[i]
                const pronunciation = shuffleData.pronunciations[i]

                if (
                  !!shuffleData.meaningFilter &&
                  !filterMatches(shuffleData.meaningFilter, meaning)
                ) {
                  return null
                }

                if (
                  displayPronunciation &&
                  !!shuffleData.pronunciationFilter &&
                  !filterMatches(shuffleData.pronunciationFilter, pronunciation)
                ) {
                  return null
                }

                return i
              })
              .filter((i): i is number => typeof i === 'number')

            const clickedWord =
              typeof shuffleData.currentClick.word === 'number'
                ? shuffleData.words[shuffleData.currentClick.word]
                : null

            const clickedPronunciation =
              typeof shuffleData.currentClick.pronunciation === 'number' &&
              displayPronunciation
                ? shuffleData.pronunciations[
                    shuffleData.currentClick.pronunciation
                  ]
                : null

            const handleTab = (shiftKey: boolean) => {
              const newShuffleData = {
                ...shuffleData,
              }

              const newWords = shuffleData.words.slice()

              if (shiftKey) {
                const lastWord = newWords.pop()

                newWords.unshift(lastWord as string)
              } else {
                const firstWord = newWords.shift()

                newWords.push(firstWord as string)
              }

              newShuffleData.words = newWords

              setShuffleData(newShuffleData)
            }

            return (
              <div className="max-w-[100%] overflow-auto whitespace-pre-line rounded-[12px] border-[2px] border-[#ccc] p-[10px]">
                <div>
                  {clickedWord && <span>{clickedWord}</span>}
                  {clickedPronunciation && (
                    <span className="ml-[4px]">{clickedPronunciation}</span>
                  )}
                  {displayPronunciation && (
                    <TextInput
                      inputRef={pronunciationFilterRef}
                      onChange={e => {
                        const newShuffleData = {
                          ...shuffleData,
                        }

                        newShuffleData.pronunciationFilter = e.target.value

                        setShuffleData(newShuffleData)
                      }}
                      onKeyUp={e => {
                        if (e.key === 'Enter') {
                          if (!filteredData.length) return

                          const pronunciation =
                            shuffleData.pronunciations[filteredData[0]]

                          const index = shuffleData.pronunciations.findIndex(
                            p => p === pronunciation,
                          )

                          onPronunciationClicked(index)
                        } else if (e.key === 'Tab') {
                          handleTab(e.shiftKey)
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
                    onChange={e => {
                      const newShuffleData = {
                        ...shuffleData,
                      }

                      newShuffleData.meaningFilter = e.target.value

                      setShuffleData(newShuffleData)
                    }}
                    onKeyUp={e => {
                      if (e.key === 'Enter') {
                        if (!filteredData.length) return

                        const meaning = shuffleData.meanings[filteredData[0]]

                        const index = shuffleData.meanings.findIndex(
                          m => meaning === m,
                        )

                        onMeaningClicked(index)
                      } else if (e.key === 'Tab') {
                        handleTab(e.shiftKey)
                      }
                    }}
                    placeholder={t('meaningFilter', 'Meaning Filter')}
                    value={shuffleData.meaningFilter}
                  />
                </div>
                {filteredData.map(i => {
                  const word = shuffleData.words[i]
                  const meaning = shuffleData.meanings[i]
                  const pronunciation = shuffleData.pronunciations[i]

                  const isWordClicked = shuffleData.currentClick.word === i

                  const isMeaningClicked =
                    shuffleData.currentClick.meaning === i

                  const isPronunciationClicked =
                    shuffleData.currentClick.pronunciation === i

                  return (
                    <div
                      className="flex min-w-[500px] flex-row gap-[10px] border-b-[1px] border-[#ccc] py-[10px] text-[22px]"
                      key={i}
                    >
                      <div
                        className={[
                          isWordClicked &&
                          !shuffleData.meaningFilter &&
                          !shuffleData.pronunciationFilter
                            ? CLICKED_STYLE
                            : '',
                          'w-[100px] min-w-[100px] cursor-pointer',
                        ].join(' ')}
                        onClick={() => {
                          if (
                            shuffleData.meaningFilter ||
                            shuffleData.pronunciationFilter
                          ) {
                            return
                          }

                          const newShuffleData = {
                            ...shuffleData,
                          }

                          newShuffleData.currentClick = {
                            ...shuffleData.currentClick,
                            word: isWordClicked ? null : i,
                          }

                          if (displayPronunciation) {
                            pronunciationFilterRef.current?.focus()
                          } else {
                            meaningFilterRef.current?.focus()
                          }

                          setShuffleData(newShuffleData)
                        }}
                      >
                        {shuffleData.meaningFilter ||
                        shuffleData.pronunciationFilter
                          ? '-'
                          : word}
                      </div>
                      {displayPronunciation && (
                        <div
                          className={[
                            isPronunciationClicked ? CLICKED_STYLE : '',
                            'font-italic w-[200px] min-w-[200px] cursor-pointer font-bold',
                          ].join(' ')}
                          onClick={() => onPronunciationClicked(i)}
                        >
                          {shuffleData.meaningFilter ? '-' : pronunciation}
                        </div>
                      )}
                      <div
                        className={[
                          isMeaningClicked ? CLICKED_STYLE : '',
                          'cursor-pointer',
                        ].join(' ')}
                        onClick={() => onMeaningClicked(i)}
                      >
                        {shuffleData.pronunciationFilter ? '-' : meaning}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          return (
            <div className="mb-[24px] flex h-[400px] w-[100%] flex-col gap-[12px] overflow-auto whitespace-pre-line rounded-[12px] border-[2px] border-[#ccc] p-[10px]">
              {dictResponse[0].words.map((dict, i) => {
                if (!displayOneWord && dict.word.length === 1) {
                  return null
                }

                return (
                  <div className="flex flex-row gap-[10px]" key={i}>
                    <div className="flex flex-col items-center justify-center">
                      <RxCross2
                        className="cursor-pointer"
                        onClick={() => {
                          const allDisplayed =
                            Array.from(displayedItems).length ===
                            dictResponse[0].words.length

                          const newDisplayedItems = new Set(displayedItems)

                          if (!allDisplayed) {
                            newDisplayedItems.delete(i)
                          }

                          setDisplayedItems(
                            new Set(
                              Array.from(newDisplayedItems).map(j =>
                                j > i ? j - 1 : j,
                              ),
                            ),
                          )

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
                          )
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      ({i + 1})
                    </div>
                    <div
                      className="cursor-pointer break-keep border-b-[1px] border-[#ccc] text-[30px]"
                      onClick={() => {
                        if (displayedItems.has(i)) {
                          displayedItems.delete(i)
                          setDisplayedItems(new Set(displayedItems))
                        } else {
                          displayedItems.add(i)
                          setDisplayedItems(new Set(displayedItems))
                        }
                      }}
                    >
                      {dict.word}
                    </div>
                    {displayedItems.has(i) &&
                      (() => {
                        const pronunciation = (() => {
                          const item = dictResponse[0].words[i]

                          if (!item.word) return ''

                          return getPronunciation(item.word)
                        })()

                        return (
                          <div className="pt-[10px]">
                            {displayPronunciation ? (
                              <i className="mr-[4px] font-bold">
                                [{pronunciation}]
                              </i>
                            ) : (
                              ''
                            )}
                            {dict.meaning}
                          </div>
                        )
                      })()}
                  </div>
                )
              })}
            </div>
          )
        })()}
    </div>
  )
}
