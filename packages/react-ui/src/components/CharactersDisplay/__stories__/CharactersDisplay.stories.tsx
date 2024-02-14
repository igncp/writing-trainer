import React from 'react'
import { mandarinHandler, englishHandler } from 'writing-trainer-core'

import CharactersDisplay from '../CharactersDisplay'

const charsObjsMandarin = mandarinHandler.轉換為字元對象列表({
  charsToRemove: [',', '.'],
  text: '崩比筆,壁必畢.閉編',
  語言選項: {
    dictionary: {
      壁: 'bi4',
      崩: 'beng1',
      必: 'bi4',
      比: 'bi3',
      畢: 'bi4',
      筆: 'bi3',
      編: 'bian1',
      閉: 'bi4',
    },
  },
})

const commonProps = {
  onCharClick: () => console.log('on-click'),
  字元對象列表: charsObjsMandarin,
}

const charObjsEnglish = englishHandler.轉換為字元對象列表({
  charsToRemove: [],
  text: 'Sample of English text',
})

const Common = () => {
  return <CharactersDisplay {...commonProps} shouldHidePronunciation={false} />
}

const WithoutPronunciation = () => {
  return <CharactersDisplay {...commonProps} shouldHidePronunciation />
}

const DifferentWidthsNoPronunciation = () => {
  return (
    <CharactersDisplay
      {...commonProps}
      shouldHaveDifferentWidths
      shouldHidePronunciation
      字元對象列表={charObjsEnglish}
    />
  )
}

export default {
  title: 'Components/CharactersDisplay',
}

export { Common, DifferentWidthsNoPronunciation, WithoutPronunciation }
