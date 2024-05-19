import { 字元對象類別 } from '#/core'
import { MutableRefObject, useEffect, useRef } from 'react'

const CHAR_WIDTH = 25
const MAX_HEIGHT = 160

type Props = {
  fontSize?: number
  字元對象列表: 字元對象類別[]
  應該有不同的寬度?: boolean
  應該隱藏發音: boolean
  按一下該符號?: (o: {
    字元對象: 字元對象類別
    字元對象列表: 字元對象類別[]
    索引: number
  }) => void
  重點字元索引?: number
  重點字元顏色?: string
  顯示目前字元的發音?: boolean
}

const CharactersDisplay = ({
  fontSize,
  字元對象列表,
  應該有不同的寬度,
  應該隱藏發音,
  按一下該符號,
  重點字元索引,
  重點字元顏色,
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
      style={{ maxHeight: MAX_HEIGHT, overflow: 'auto', position: 'relative' }}
    >
      {字元對象列表.map((字元對象, 索引) => {
        const { pronunciation, word } = 字元對象

        return (
          <div
            key={`${索引}${字元對象.word}`}
            onClick={e => {
              e.stopPropagation()

              按一下該符號?.({
                字元對象,
                字元對象列表,
                索引,
              })
            }}
            style={{
              color: 索引 === 重點字元索引 ? 重點字元顏色 : undefined,
              cursor: pronunciation && 按一下該符號 ? 'pointer' : 'default',
              display: 'inline-block',
              marginBottom: 10,
              opacity: 索引 === 重點字元索引 ? 1 : 0.3,
            }}
          >
            <div
              style={{
                fontSize: 13,
                height: 10,
                marginBottom: 1,
                textAlign: 'center',
                ...(應該有不同的寬度 ? {} : { width: charWidth }),
              }}
            >
              {(() => {
                if (顯示目前字元的發音 && 索引 === 重點字元索引)
                  return pronunciation

                return 應該隱藏發音 ? '' : pronunciation
              })()}
            </div>
            <div
              className="min-width-[10px] pt-[5px] text-center"
              style={{
                fontSize: usedFontSize + 10,
                ...(應該有不同的寬度 ? {} : { width: charWidth }),
              }}
            >
              {word}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CharactersDisplay
