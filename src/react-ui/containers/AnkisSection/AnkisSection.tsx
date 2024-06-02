import { 字元對象類別 } from '#/core'
import CharactersDisplay from '#/react-ui/components/CharactersDisplay/CharactersDisplay'
import { AnkiGql } from '#/react-ui/graphql/graphql'
import {
  changeToSimplified,
  changeToTraditional,
} from '#/react-ui/languages/common/conversion'
import { backendClient } from '#/react-ui/lib/backendClient'
import { useCallback, useEffect, useState } from 'react'
import { FaSpinner, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

import 按鈕 from '../../components/按鈕/按鈕'
import 文字區 from '../../components/文字區/文字區'

export enum AnkisMode {
  Add = 'add',
  Main = 'main',
}

type AnkiRoundItem = Pick<AnkiGql, 'id' | 'front' | 'back'>

type Props = {
  language: string
  mode: AnkisMode
  setMode: (mode: AnkisMode | null) => void
  字元對象列表: 字元對象類別[]
}

type AnkisRoundProps = {
  ankisRound: AnkiRoundItem[] | null
  setAnkisRound: (ankisRound: AnkiRoundItem[] | null) => void
}

const AnkiRound = ({ ankisRound, setAnkisRound }: AnkisRoundProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShowingBack, setIsShowingBack] = useState(false)
  const [showBothCharsTypes, setShowBothCharsTypes] = useState(true)
  const currentAnki = ankisRound?.[currentIndex]

  return (
    <div>
      <div>回合</div>
      <按鈕
        onClick={() => {
          setAnkisRound(null)
        }}
      >
        結束
      </按鈕>
      <按鈕
        onClick={() => {
          setShowBothCharsTypes(!showBothCharsTypes)
        }}
      >
        切換顯示兩種字元類型
      </按鈕>
      <div>
        {currentAnki ? (
          (() => {
            const onNext = (guessed: boolean) => {
              backendClient
                .saveReviewedAnki({
                  guessed,
                  id: currentAnki.id,
                })
                .then(() => {
                  setIsShowingBack(false)

                  if (currentIndex + 1 < ankisRound.length) {
                    setCurrentIndex(currentIndex + 1)
                  } else {
                    setAnkisRound(null)
                  }
                })
                .catch(() => {
                  toast.error('Failed to save anki')
                })
            }

            const front = (() => {
              if (!showBothCharsTypes) return currentAnki.front

              const simplified = changeToSimplified(currentAnki.front)
              const traditional = changeToTraditional(currentAnki.front)

              return simplified === traditional
                ? simplified
                : `${traditional} / ${simplified}`
            })()

            return (
              <div className="flex flex-col gap-[24px]">
                <div>
                  第 {currentIndex + 1} / {ankisRound.length}
                </div>
                <div className="whitespace-pre rounded-[4px] border-[1px] border-[white] p-[8px]">
                  {front}
                </div>
                {isShowingBack ? (
                  <>
                    <div className="whitespace-pre rounded-[4px] border-[1px] border-[white] p-[8px]">
                      {currentAnki.back}
                    </div>
                    <div className="flex flex-row">
                      <按鈕 onClick={() => onNext(true)}>Correct</按鈕>
                      <按鈕 onClick={() => onNext(false)}>Wrong</按鈕>
                    </div>
                  </>
                ) : (
                  <div>
                    <按鈕 onClick={() => setIsShowingBack(true)}>顯示背面</按鈕>
                  </div>
                )}
              </div>
            )
          })()
        ) : (
          <div>沒有更多了</div>
        )}
      </div>
    </div>
  )
}

const AnkisMain = ({ setMode }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [ankis, setAnkis] = useState<Awaited<
    ReturnType<typeof backendClient.getUserAnkis>
  > | null>(null)
  const [ankisRound, setAnkisRound] = useState<AnkiRoundItem[] | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const pageItems = 10

  const getAnkis = useCallback(
    (pageNum: number = currentPage) => {
      if (ankisRound) return

      setIsLoading(true)

      backendClient
        .getUserAnkis(10, pageNum * pageItems)
        .then(_ankis => {
          setAnkis(_ankis)
        })
        .catch(() => {
          toast.error('Failed to load ankis')
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [ankisRound, currentPage],
  )

  useEffect(() => {
    getAnkis()
  }, [getAnkis])

  if (ankisRound) {
    return <AnkiRound ankisRound={ankisRound} setAnkisRound={setAnkisRound} />
  }

  return (
    <div>
      <div>清單{!!ankis?.total && ` (${ankis.total})`}</div>
      <按鈕
        onClick={() => {
          setIsLoading(true)

          backendClient
            .getAnkisRound()
            .then(_ankisRound => {
              setAnkisRound(_ankisRound)
            })
            .catch(() => {
              toast.error('Failed to load ankis round')
            })
            .finally(() => {
              setIsLoading(false)
            })
        }}
      >
        開始 Anki 回合
      </按鈕>
      <按鈕 onClick={() => setMode(AnkisMode.Add)}>添新</按鈕>
      {isLoading ? (
        <div>
          <span className="animate-spin">
            <FaSpinner color="#00f" />
          </span>
        </div>
      ) : (
        <ul className="width-max flex flex-col">
          {ankis?.list.map((anki, ankiItemIdx) => (
            <li
              className="flex flex-1 flex-row py-[3px] even:bg-[#333]"
              key={anki.id}
            >
              - ({ankis.total - (currentPage * pageItems + ankiItemIdx)}):{' '}
              <span className="ml-[4px] flex-1">{anki.front}</span>{' '}
              <span className="mx-[12px]">{anki.language}</span>{' '}
              <span className="mx-[12px]">
                ({anki.correct}/{anki.correct + anki.incorrect})
              </span>{' '}
              <button
                className="mr-[8px]"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true)

                  backendClient
                    .saveAnki({
                      back: '',
                      front: '',
                      id: anki.id,
                      language: '',
                    })
                    .then(() => getAnkis())
                    .catch(() => {
                      toast.error('Failed to delete anki')
                    })
                    .finally(() => {
                      setIsLoading(false)
                    })
                }}
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      )}
      {!!ankis &&
        (() => {
          const lastPage = Math.ceil(ankis.total / pageItems)

          return (
            <div className="flex flex-row gap-[24px]">
              <按鈕
                disabled={isLoading || currentPage === 0}
                onClick={() => {
                  setCurrentPage(currentPage - 1)
                }}
              >
                上一頁
              </按鈕>
              <按鈕
                disabled={isLoading || currentPage === 0}
                onClick={() => {
                  setCurrentPage(0)
                }}
              >
                1
              </按鈕>
              {lastPage > 1 && (
                <>
                  {currentPage > 1 && currentPage < lastPage - 1 && (
                    <div>{currentPage + 1}</div>
                  )}
                  <按鈕
                    disabled={isLoading || currentPage === lastPage - 1}
                    onClick={() => {
                      setCurrentPage(lastPage - 1)
                    }}
                  >
                    {lastPage}
                  </按鈕>
                </>
              )}
              <按鈕
                disabled={isLoading || currentPage === lastPage - 1}
                onClick={() => {
                  setCurrentPage(currentPage + 1)
                }}
              >
                下一頁
              </按鈕>
            </div>
          )
        })()}
    </div>
  )
}

const AnkisAdd = ({ language, setMode, 字元對象列表 }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [frontVal, setFrontVal] = useState('')
  const [backVal, setBackVal] = useState('')
  const [showPronunciation, setShowPronunciation] = useState(true)
  const [frontRef, setFrontRef] = useState<HTMLTextAreaElement | null>(null)

  const clear = () => {
    setFrontVal('')
    setBackVal('')
  }

  return (
    <div>
      <按鈕 onClick={() => setMode(AnkisMode.Main)}>顯示清單</按鈕>
      <按鈕
        onClick={() => {
          navigator.clipboard.writeText(
            字元對象列表.map(字元對象 => 字元對象.word).join(''),
          )
        }}
      >
        複製文字字元
      </按鈕>
      <按鈕
        onClick={() => {
          navigator.clipboard.writeText(
            字元對象列表.map(字元對象 => 字元對象.pronunciation).join(' '),
          )
        }}
      >
        複製文字發音
      </按鈕>
      <div className="my-[8px]">
        <CharactersDisplay
          字元對象列表={字元對象列表}
          應該隱藏發音={!showPronunciation}
          按一下該符號={({ 字元對象 }) => {
            setFrontVal(frontVal + 字元對象.word)

            setBackVal(
              [backVal, 字元對象.pronunciation].filter(Boolean).join(' '),
            )
          }}
        />
      </div>
      <div className="flex flex-row gap-[4px]">
        <按鈕
          onClick={() => {
            setShowPronunciation(!showPronunciation)
          }}
        >
          切換顯示發音
        </按鈕>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()

          setIsLoading(true)

          backendClient
            .saveAnki({
              back: backVal,
              front: frontVal,
              id: '',
              language,
            })
            .then(() => {
              clear()
              frontRef?.focus()
            })
            .finally(() => {
              setIsLoading(false)
            })
        }}
      >
        <文字區
          autoFocus
          className="border-[#777]"
          onChange={e => setFrontVal(e.target.value)}
          placeholder="前面"
          setRef={setFrontRef}
          tabIndex={1}
          value={frontVal}
        />
        <文字區
          className="border-[#777]"
          onChange={e => setBackVal(e.target.value)}
          placeholder="背面"
          tabIndex={2}
          value={backVal}
        />
        <按鈕 disabled={isLoading || !frontVal || !backVal} tabIndex={3}>
          保存
        </按鈕>
      </form>
    </div>
  )
}

export const AnkisSection = (props: Props) => {
  const { mode, setMode } = props

  return (
    <div>
      <h1>Ankis</h1>
      <按鈕 onClick={() => setMode(null)}>關閉</按鈕>
      {mode === AnkisMode.Main && <AnkisMain {...props} />}
      {mode === AnkisMode.Add && <AnkisAdd {...props} />}
    </div>
  )
}
