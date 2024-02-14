import React, { useEffect, useRef } from 'react'
import { 字元對象類別 } from 'writing-trainer-core'

import { T_CharsDisplayClickHandler } from '../../languages/types'

const CHAR_WIDTH = 25
const MAX_HEIGHT = 160

type Props = {
  fontSize?: number
  onCharClick: T_CharsDisplayClickHandler
  shouldHaveDifferentWidths?: boolean
  shouldHidePronunciation: boolean
  showCurrentCharPronunciation?: boolean
  字元對象列表: 字元對象類別[]
  重點字元索引?: number
  重點字元顏色?: string
}

const CharactersDisplay = ({
  fontSize,
  onCharClick,
  shouldHaveDifferentWidths,
  shouldHidePronunciation,
  showCurrentCharPronunciation,
  字元對象列表,
  重點字元索引,
  重點字元顏色,
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
      ref={wrapperRef as React.MutableRefObject<HTMLDivElement>}
      style={{ maxHeight: MAX_HEIGHT, overflow: 'auto', position: 'relative' }}
    >
      {字元對象列表.map((字元對象, 索引) => {
        const { pronunciation, word } = 字元對象

        return (
          <div
            key={`${索引}${字元對象.word}`}
            onClick={e => {
              e.stopPropagation()

              if (!onCharClick) {
                return
              }

              onCharClick({
                字元對象,
                字元對象列表,
                索引,
              })
            }}
            style={{
              color: 索引 === 重點字元索引 ? 重點字元顏色 : undefined,
              cursor: pronunciation && onCharClick ? 'pointer' : 'default',
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
                ...(shouldHaveDifferentWidths ? {} : { width: charWidth }),
              }}
            >
              {(() => {
                if (showCurrentCharPronunciation && 索引 === 重點字元索引)
                  return pronunciation

                return shouldHidePronunciation ? '' : pronunciation
              })()}
            </div>
            <div
              style={{
                fontSize: usedFontSize + 10,
                minWidth: 10,
                paddingTop: 5,
                textAlign: 'center',
                ...(shouldHaveDifferentWidths ? {} : { width: charWidth }),
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
