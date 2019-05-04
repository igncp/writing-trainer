import React from 'react'

interface T_CharObj {
  word: string
  pronunciation: string
}

type TCharactersDisplay = React.FC<{
  charsObjs: T_CharObj[]
  onCharClick?(opts: {
    charObj: T_CharObj
    charsObjs: T_CharObj[]
    index: number
  }): void
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
            <div style={{ textAlign: 'center', height: 20, width: '100%' }}>
              {shouldHidePronunciation ? '' : pronunciation}
            </div>
            <div style={{ width: 45, textAlign: 'center', fontSize: 30 }}>
              {word}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CharactersDisplay
