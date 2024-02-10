import React from 'react'
import { CharObj } from 'writing-trainer-core'

import { fireEvent, render } from '@testing-library/react'

import CharactersDisplay from '../CharactersDisplay'

const commonProps = {
  charsObjs: [new CharObj({ pronunciation: 'bar', word: 'FOO' })],
  focusedIndex: 0,
  onCharClick: jest.fn(),
  shouldHidePronunciation: false,
}

describe('按鈕', () => {
  it('renders the content', () => {
    const { getByText } = render(<CharactersDisplay {...commonProps} />)

    expect(() => getByText('FOO')).not.toThrow()
    expect(() => getByText('bar')).not.toThrow()
  })

  // eslint-disable-next-line padding-line-between-statements
  ;[
    ['word', 'FOO'],
    ['pronunciation', 'bar'],
  ].forEach(([item, txt]) => {
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
