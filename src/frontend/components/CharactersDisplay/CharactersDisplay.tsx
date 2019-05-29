import React from 'react'

const CHAR_WIDTH = 55

interface T_CharObj {
  word: string
  pronunciation: string
}

export type T_CharsDisplayClickHandler = (opts: {
  charObj: T_CharObj
  charsObjs: T_CharObj[]
  index: number
}) => void

type TCharactersDisplay = React.FC<{
  charsObjs: T_CharObj[]
  onCharClick: T_CharsDisplayClickHandler
  shouldHidePronunciation: boolean
}>

const CharactersDisplay: TCharactersDisplay = ({
  charsObjs,
  onCharClick,
  shouldHidePronunciation,
}) => {
  return (
    <div>
      {charsObjs.map((charObj, index) => {
        const { word, pronunciation } = charObj

        return (
          <div
            style={{
              cursor: pronunciation ? 'pointer' : 'default',
              display: 'inline-block',
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
              style={{ width: CHAR_WIDTH, textAlign: 'center', fontSize: 30 }}
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
