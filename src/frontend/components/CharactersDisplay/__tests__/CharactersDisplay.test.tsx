import React from 'react'
import { render } from 'react-testing-library'

import CharactersDisplay from '../CharactersDisplay'

describe('CharactersDisplay', () => {
  it('renders the content', () => {
    const { getByText } = render(
      <CharactersDisplay
        pronunciation="pronunciation value"
        specialChars="special characters value"
        text="text value"
      />
    )

    expect(() => getByText('pronunciation value')).not.toThrow()
    expect(() => getByText('special characters value')).not.toThrow()
    expect(() => getByText('text value')).not.toThrow()
    expect(() => getByText('foo')).toThrow()
  })
})
