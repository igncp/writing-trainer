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
      style={{ maxHeight: MAX_HEIGHT, overflow: 'auto', position: 'relative' }}
      ref={wrapperRef}
    >
      {charsObjs.map((charObj, index) => {
        const { word, pronunciation } = charObj

        return (
          <div
            style={{
              cursor: pronunciation ? 'pointer' : 'default',
              display: 'inline-block',
              marginBottom: 10,
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
                fontSize: 13,
                height: 10,
                marginBottom: 1,
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
