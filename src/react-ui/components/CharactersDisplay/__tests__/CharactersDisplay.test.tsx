import { 字元對象類別 } from '#/core'

import { fireEvent, render } from '@testing-library/react'

import CharactersDisplay from '../CharactersDisplay'

const commonProps = {
  字元對象列表: [new 字元對象類別({ pronunciation: 'bar', word: 'FOO' })],
  應該隱藏發音: false,
  按一下該符號: jest.fn(),
  重點字元索引: 0,
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
    it(`calls 按一下該符號 when clicking the ${item} with the expected data`, () => {
      const { getByText } = render(<CharactersDisplay {...commonProps} />)

      const el = getByText(txt)

      expect(commonProps.按一下該符號.mock.calls).toEqual([])

      fireEvent.click(el)

      expect(commonProps.按一下該符號.mock.calls).toEqual([
        [
          {
            字元對象: commonProps.字元對象列表[0],
            字元對象列表: commonProps.字元對象列表,
            索引: 0,
          },
        ],
      ])
    })
  })
})
