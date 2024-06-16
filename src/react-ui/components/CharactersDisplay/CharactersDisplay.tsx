import { T_CharObj } from '#/core'
import { MutableRefObject, useEffect, useRef } from 'react'

const CHAR_WIDTH = 25
const MAX_HEIGHT = 160

type Props = {
  charsObjsList: T_CharObj[]
  colorOfCurrentChar?: string
  fontSize?: number
  onSymbolClick?: (o: {
    charObj: T_CharObj
    charsObjsList: T_CharObj[]
    index: number
  }) => void
  應該有不同的寬度?: boolean
  應該隱藏發音: boolean
  重點字元索引?: number
  顯示目前字元的發音?: boolean
}

const CharactersDisplay = ({
  charsObjsList,
  colorOfCurrentChar,
  fontSize,
  onSymbolClick,
  應該有不同的寬度,
  應該隱藏發音,
  重點字元索引,
  顯示目前字元的發音,
}: Props) => {
  const usedFontSize = fontSize ?? 30
  const wrapperRef = useRef<HTMLDivElement | undefined>()
  const charWidth = CHAR_WIDTH + usedFontSize

  useEffect(() => {
    if (!wrapperRef.current || (!wrapperRef.current.childNodes as unknown)) {
      return () => {}
    }

    const charEl = wrapperRef.current.childNodes[
      重點字元索引 as number
    ] as HTMLDivElement

    if (!(charEl as unknown)) {
      return () => {}
    }

    const { scrollTop } = wrapperRef.current
    const { offsetTop } = charEl
    const { height } = charEl.getBoundingClientRect()

    if (offsetTop + height > scrollTop + MAX_HEIGHT) {
      wrapperRef.current.scrollTop = offsetTop + height - MAX_HEIGHT
    } else if (offsetTop < scrollTop) {
      wrapperRef.current.scrollTop = offsetTop
    }
  }, [重點字元索引])

  return (
    <div
      ref={wrapperRef as MutableRefObject<HTMLDivElement>}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '4px',
        maxHeight: MAX_HEIGHT,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {charsObjsList.map((charObj, index) => {
        const { pronunciation, word } = charObj
        const shouldHidePronunciation =
          !(顯示目前字元的發音 && index === 重點字元索引) && 應該隱藏發音

        return (
          <span
            key={`${index}${charObj.word}`}
            onClick={e => {
              e.stopPropagation()

              onSymbolClick?.({
                charObj,
                charsObjsList,
                index,
              })
            }}
            style={{
              color: index === 重點字元索引 ? colorOfCurrentChar : undefined,
              cursor: pronunciation && onSymbolClick ? 'pointer' : 'default',
              display: 'inline-flex',
              flexDirection: 'column',
              marginBottom: 10,
              opacity: index === 重點字元索引 ? 1 : 0.3,
            }}
          >
            <span
              style={{
                fontSize: 13,
                height: 10,
                textAlign: 'center',
                userSelect: 'none',
                visibility: shouldHidePronunciation ? 'hidden' : undefined,
                ...(應該有不同的寬度 ? {} : { width: charWidth }),
              }}
            >
              {pronunciation}
            </span>
            <span
              className="min-width-[10px] inline pt-[5px] text-center"
              style={{
                fontSize: usedFontSize + 10,
                ...(應該有不同的寬度 ? {} : { width: charWidth }),
              }}
            >
              {word}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export default CharactersDisplay
