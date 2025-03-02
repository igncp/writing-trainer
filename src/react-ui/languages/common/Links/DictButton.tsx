import { useMainContext } from '#/react-ui/containers/main-context'
import { DictResponse } from '#/react-ui/graphql/graphql'
import { backendClient } from '#/react-ui/lib/backendClient'
import { TOOLTIP_ID } from '#/utils/tooltip'
import { useEffect, useState } from 'react'
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

export const DictContent = ({
  dictResponse,
  setDictResponse,
  text,
}: {
  dictResponse: DictResponseState
  setDictResponse: (dictResponse: [DictResponse, string] | null) => void
  text: string
}) => {
  const [displayedItems, setDisplayedItems] = useState(new Set<number>())
  const [displayOneWord, setDisplayOneWord] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (text) {
      setDictResponse(null)
      setDisplayedItems(new Set())
      setDisplayOneWord(false)
    }
  }, [text, setDictResponse])

  if (!dictResponse?.[1]) {
    return null
  }

  return (
    <div className="flex w-[100%] flex-col gap-[16px]">
      <div className="flex flex-row gap-[12px]">
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
          {displayOneWord ? t('dict.hideOneWord') : t('dict.displayOneWord')}
        </Button>
        <Button
          onClick={() => {
            setDictResponse(null)
          }}
        >
          {t('dict.clear')}
        </Button>
      </div>
      <div>
        {t('dict.total')}: {dictResponse[0].words.length}
      </div>
      {dictResponse[1] === text && (
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
                {displayedItems.has(i) && (
                  <div className="pt-[10px]">{dict.meaning}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
