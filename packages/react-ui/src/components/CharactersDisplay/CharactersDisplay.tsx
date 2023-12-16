import React, { useEffect, useRef } from 'react'
import { CharObj } from 'writing-trainer-core'

import { T_CharsDisplayClickHandler } from '../../languages/types'

const CHAR_WIDTH = 25
const MAX_HEIGHT = 160

type Props = {
  charsObjs: CharObj[]
  focusedIndex?: number
  fontSize?: number
  onCharClick: T_CharsDisplayClickHandler
  shouldHaveDifferentWidths?: boolean
  shouldHidePronunciation: boolean
}

const CharactersDisplay = ({
  charsObjs,
  focusedIndex,
  fontSize,
  onCharClick,
  shouldHaveDifferentWidths,
  shouldHidePronunciation,
}: Props) => {
  const usedFontSize = fontSize ?? 30
  const wrapperRef = useRef<HTMLDivElement | undefined>()
  const charWidth = CHAR_WIDTH + usedFontSize

  useEffect(() => {
    if (!wrapperRef.current || (!wrapperRef.current.childNodes as unknown)) {
      return () => {}
    }

    const charEl = wrapperRef.current.childNodes[
      focusedIndex as number
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
  }, [focusedIndex])

  return (
    <div
      ref={wrapperRef as React.MutableRefObject<HTMLDivElement>}
      style={{ maxHeight: MAX_HEIGHT, overflow: 'auto', position: 'relative' }}
    >
      {charsObjs.map((charObj, index) => {
        const { word, pronunciation } = charObj

        return (
          <div
            key={`${index}${charObj.word}`}
            onClick={e => {
              e.stopPropagation()

              if (!onCharClick) {
                return
              }

              onCharClick({
                charObj,
                charsObjs,
                index,
              })
            }}
            style={{
              cursor: pronunciation && onCharClick ? 'pointer' : 'default',
              display: 'inline-block',
              marginBottom: 10,
              opacity: index === focusedIndex ? 1 : 0.3,
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
              {shouldHidePronunciation ? '' : pronunciation}
            </div>
            <div
              style={{
                fontSize: usedFontSize + 10,
                minWidth: 10,
                paddingTop: 15,
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
