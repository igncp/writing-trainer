import React from 'react'
import { fireEvent, render } from 'react-testing-library'

import CharactersDisplay from '../CharactersDisplay'

const commonProps = {
  charsObjs: [{ word: 'FOO', pronunciation: 'bar', index: 0 }],
  focusedIndex: 0,
  onCharClick: jest.fn(),
  shouldHidePronunciation: false,
}

describe('Button', () => {
  it('renders the content', () => {
    const { getByText } = render(<CharactersDisplay {...commonProps} />)

    expect(() => getByText('FOO')).not.toThrow()
    expect(() => getByText('bar')).not.toThrow()
  })
  ;[['word', 'FOO'], ['pronunciation', 'bar']].forEach(([item, txt]) => {
    it(`calls onCharClick when clicking the ${item} with the expected data`, () => {
      const { getByText } = render(<CharactersDisplay {...commonProps} />)

      const el = getByText(txt)

      expect(commonProps.onCharClick.mock.calls).toEqual([])

      fireEvent.click(el)

      expect(commonProps.onCharClick.mock.calls).toEqual([
        [
          {
            charObj: commonProps.charsObjs[0],
            charsObjs: commonProps.charsObjs,
            index: 0,
          },
        ],
      ])
    })
  })
})
