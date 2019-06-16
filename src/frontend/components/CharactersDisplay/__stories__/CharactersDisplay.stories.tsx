import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { convertToCharsObjs } from '#/languages/mandarin/mandarinUtils'

import CharactersDisplay from '../CharactersDisplay'

const charsObjs = convertToCharsObjs({
  charsToRemove: ',.',
  pronunciation: 'beng1 bi3 bi3 bi4 bi4 bi4 bi4 bian1',
  text: '崩比筆,壁必畢.閉編',
})

const commonProps = {
  charsObjs,
  onCharClick: action('on-click'),
}

storiesOf('Components|CharactersDisplay', module)
  .add('common', () => {
    return (
      <CharactersDisplay {...commonProps} shouldHidePronunciation={false} />
    )
  })
  .add('without pronunciation', () => {
    return <CharactersDisplay {...commonProps} shouldHidePronunciation />
  })
