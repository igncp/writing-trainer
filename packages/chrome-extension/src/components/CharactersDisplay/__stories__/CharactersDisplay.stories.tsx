import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import mandarinHandler from 'writing-trainer-core/dist/languageHandlers/mandarin'
import englishHandler from 'writing-trainer-core/dist/languageHandlers/english'

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
  onCharClick: action('on-click'),
}

const charObjsEnglish = englishHandler.convertToCharsObjs({
  charsToRemove: [],
  text:
    'The feeling around the ground at that moment was distinct from the usual triumphalism. As the players lined up in an oddly formal crocodile to shake hands there was a feeling for the first time of a step into something else',
})

storiesOf('Components|CharactersDisplay', module)
  .add('common', () => {
    return (
      <CharactersDisplay {...commonProps} shouldHidePronunciation={false} />
    )
  })
  .add('without pronunciation', () => {
    return <CharactersDisplay {...commonProps} shouldHidePronunciation />
  })
  .add('with different widths and no pronunciation', () => {
    return (
      <CharactersDisplay
        {...commonProps}
        charsObjs={charObjsEnglish}
        shouldHaveDifferentWidths
        shouldHidePronunciation
      />
    )
  })
