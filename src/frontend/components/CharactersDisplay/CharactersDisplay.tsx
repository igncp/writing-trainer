import React from 'react'

type TCharactersDisplay = React.FC<{
  pronunciation: string
  specialChars: string
  text: string
}>

const CharactersDisplay: TCharactersDisplay = ({
  pronunciation,
  specialChars,
  text,
}) => {
  return (
    <div>
      <p>{text}</p>
      <p>{pronunciation}</p>
      <p>{specialChars}</p>
    </div>
  )
}

export default CharactersDisplay
