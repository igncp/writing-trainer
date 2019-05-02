import React from 'react'

interface T_CharObj {
  word: string
  pronunciation: string
}

type TCharactersDisplay = React.FC<{
  charsObjs: T_CharObj[]
  onCharClick?(T_CharObj): void
  shouldHidePronunciation: boolean
}>

const CharactersDisplay: TCharactersDisplay = ({
  charsObjs,
  onCharClick,
  shouldHidePronunciation,
}) => {
  return (
    <div>
      {charsObjs.map(charObj => {
        const { word, pronunciation } = charObj

        return (
          <div
            style={{ display: 'inline-block' }}
            onClick={() => {
              onCharClick(charObj)
            }}
          >
            <div style={{ textAlign: 'center', height: 20, width: '100%' }}>
              {shouldHidePronunciation ? '' : pronunciation}
            </div>
            <div style={{ width: 50, textAlign: 'center', fontSize: 30 }}>
              {word}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CharactersDisplay
