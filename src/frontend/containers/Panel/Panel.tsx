import React, { useState } from 'react'

import Button from '../../components/Button/Button'
import CharactersDisplay from '../../components/CharactersDisplay/CharactersDisplay'
import PanelBase from '../../components/PanelBase/PanelBase'
import TextArea from '../../components/TextArea/TextArea'

import { convertToCharsObjs } from '../../languages/mandarin/utils'

const createInputSetterFn = setValue => e => {
  setValue(e.target.value)
}

type TPanel = React.FC<{
  onHideRequest(): void
  text: string
}>

const Panel: TPanel = ({ onHideRequest, text }) => {
  const [originalTextValue, setOriginalText] = useState(text)
  const [pronunciationValue, setPronunciation] = useState('')
  const [specialCharsValue, setSpecialChars] = useState('')
  const [writingValue, setWriting] = useState('')
  const [practiceValue, setPractice] = useState('')

  const clearValues = () =>
    [
      setOriginalText,
      setPronunciation,
      setSpecialChars,
      setWriting,
      setPractice,
    ].forEach(fn => fn(''))

  return (
    <PanelBase>
      <Button onClick={clearValues}>Clear</Button>
      <Button onClick={onHideRequest} style={{ float: 'right' }}>
        Hide
      </Button>
      <div>
        <TextArea
          onChange={createInputSetterFn(setOriginalText)}
          placeholder="Original text"
          rows={3}
          value={originalTextValue}
        />
        <TextArea
          onChange={createInputSetterFn(setPronunciation)}
          placeholder="Pronunciation"
          rows={2}
          value={pronunciationValue}
        />
        <TextArea
          onChange={createInputSetterFn(setSpecialChars)}
          placeholder="Special characters"
          rows={1}
          value={specialCharsValue}
        />
        <CharactersDisplay
          charsObjs={convertToCharsObjs({
            charsToRemove: specialCharsValue,
            pronunciation: pronunciationValue,
            text: originalTextValue,
          })}
          shouldHidePronunciation={false}
        />
        <TextArea
          onChange={createInputSetterFn(setWriting)}
          placeholder="Writing area"
          rows={1}
          value={writingValue}
        />
        <TextArea
          onChange={createInputSetterFn(setPractice)}
          placeholder="Practice text"
          rows={4}
          value={practiceValue}
        />
      </div>
    </PanelBase>
  )
}

export default Panel
