import React from 'react'
import { mandarinHandler, englishHandler } from 'writing-trainer-core'

import CharactersDisplay from '../CharactersDisplay'

const charsObjsMandarin = mandarinHandler.convertToCharsObjs({
  charsToRemove: [',', '.'],
  langOpts: {
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
  text: '崩比筆,壁必畢.閉編',
})

const commonProps = {
  charsObjs: charsObjsMandarin,
  onCharClick: () => console.log('on-click'),
}

const charObjsEnglish = englishHandler.convertToCharsObjs({
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
      charsObjs={charObjsEnglish}
      shouldHaveDifferentWidths
      shouldHidePronunciation
    />
  )
}

export default {
  title: 'Components/CharactersDisplay',
}

export { Common, WithoutPronunciation, DifferentWidthsNoPronunciation }
