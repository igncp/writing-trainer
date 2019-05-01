import { storiesOf } from '@storybook/react'
import * as React from 'react'

import CharactersDisplay from '../CharactersDisplay'

storiesOf('Components|CharactersDisplay', module).add('common', () => {
  return (
    <CharactersDisplay
      pronunciation="pronunciation value"
      specialChars="special characters value"
      text="text value"
    />
  )
})
