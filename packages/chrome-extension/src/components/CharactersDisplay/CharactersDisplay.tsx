import React, { useEffect, useRef } from 'react'
import { T_CharObj } from 'writing-trainer-core'

import { T_CharsDisplayClickHandler } from '#/languages/types'

const CHAR_WIDTH = 55
const MAX_HEIGHT = 160

type T_CharactersDisplay = React.FC<{
  charsObjs: T_CharObj[]
  focusedIndex?: number
  onCharClick: T_CharsDisplayClickHandler
  shouldHaveDifferentWidths?: boolean
  shouldHidePronunciation: boolean
}>

const CharactersDisplay: T_CharactersDisplay = ({
  charsObjs,
  focusedIndex,
  onCharClick,
  shouldHaveDifferentWidths,
  shouldHidePronunciation,
}) => {
  const wrapperRef = useRef<HTMLDivElement>()

  useEffect(() => {
    if (!wrapperRef.current || !wrapperRef.current.childNodes) {
      return () => {}
    }

    const charEl = wrapperRef.current.childNodes[focusedIndex] as HTMLDivElement

    if (!charEl) {
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
      ref={wrapperRef}
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
              opacity: index === focusedIndex ? 1 : 0.5,
            }}
          >
            <div
              style={{
                fontSize: 13,
                height: 10,
                marginBottom: 1,
                textAlign: 'center',
                ...(shouldHaveDifferentWidths ? {} : { width: CHAR_WIDTH }),
              }}
            >
              {shouldHidePronunciation ? '' : pronunciation}
            </div>
            <div
              style={{
                fontSize: 40,
                minWidth: 10,
                textAlign: 'center',
                ...(shouldHaveDifferentWidths ? {} : { width: CHAR_WIDTH }),
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
