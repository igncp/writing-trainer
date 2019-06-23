import React, { useEffect, useRef } from 'react'

import { TCharObj } from '#/languages/types'

const CHAR_WIDTH = 55
const MAX_HEIGHT = 160

export type T_CharsDisplayClickHandler = (opts: {
  charObj: TCharObj
  charsObjs: TCharObj[]
  index: number
}) => void

type TCharactersDisplay = React.FC<{
  charsObjs: TCharObj[]
  focusedIndex?: number
  onCharClick: T_CharsDisplayClickHandler
  shouldHidePronunciation: boolean
}>

const CharactersDisplay: TCharactersDisplay = ({
  charsObjs,
  focusedIndex,
  onCharClick,
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
    const { top, height } = charEl.getBoundingClientRect()

    if (top + height > scrollTop + MAX_HEIGHT) {
      wrapperRef.current.scrollTop = top + height - MAX_HEIGHT
    } else if (top < scrollTop) {
      wrapperRef.current.scrollTop = top
    }
  }, [focusedIndex])

  return (
    <div style={{ maxHeight: MAX_HEIGHT, overflow: 'auto' }} ref={wrapperRef}>
      {charsObjs.map((charObj, index) => {
        const { word, pronunciation } = charObj

        return (
          <div
            style={{
              cursor: pronunciation ? 'pointer' : 'default',
              display: 'inline-block',
              opacity: index === focusedIndex ? 1 : 0.5,
            }}
            key={`${index}${charObj.word}`}
            onClick={e => {
              e.stopPropagation()
              onCharClick({
                charObj,
                charsObjs,
                index,
              })
            }}
          >
            <div
              style={{
                height: 20,
                marginBottom: 5,
                textAlign: 'center',
                width: CHAR_WIDTH,
              }}
            >
              {shouldHidePronunciation ? '' : pronunciation}
            </div>
            <div
              style={{ width: CHAR_WIDTH, textAlign: 'center', fontSize: 40 }}
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
