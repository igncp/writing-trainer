import React from 'react'
import { fireEvent, render } from 'react-testing-library'

import RecordsList from '../RecordsList'

const commonProps = {
  onRecordLoad: jest.fn(),
  onRecordRemove: jest.fn(),
  records: [
    {
      createdOn: Date.now(),
      id: 0,
      language: 'spanish',
      lastLoadedOn: Date.now(),
      link: 'link value',
      name: 'name value',
      pronunciation: 'pronunciation value',
      text: 'text value',
    },
  ],
}

describe('RecordsList', () => {
  it('renders the expected content', () => {
    const { getByText } = render(<RecordsList {...commonProps} />)

    // should render these values
    expect(() => getByText(txt => /name value/.test(txt))).not.toThrow()
    expect(() => getByText(txt => /spanish/.test(txt))).not.toThrow()

    // should not render these values
    expect(() => getByText(txt => /text value/.test(txt))).toThrow()
    expect(() => getByText(txt => /pronunciation value/.test(txt))).toThrow()
    expect(() => getByText(txt => /link value/.test(txt))).toThrow()
  })

  it('filters when updating text', () => {
    const { container, getByText } = render(<RecordsList {...commonProps} />)

    expect(() => getByText(txt => /name value/.test(txt))).not.toThrow()

    // several filterings
    ;[
      ['name', true],
      ['FOO', false],
      ['name value', true],
      ['name FOO', false],
      ['name spanish', true],
    ].forEach(([value, shouldDisplayItem]) => {
      fireEvent.change(container.querySelector('input'), {
        target: {
          value,
        },
      })

      const fn = () => getByText(txt => /name value/.test(txt))

      if (shouldDisplayItem) {
        expect(fn).not.toThrow()
      } else {
        expect(fn).toThrow()
      }
    })
  })
})
