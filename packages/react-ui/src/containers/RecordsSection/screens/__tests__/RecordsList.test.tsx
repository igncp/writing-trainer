import React from 'react'
import { fireEvent, render } from 'react-testing-library'

import RecordsList from '../RecordsList'

const commonProps = {
  onRecordEdit: jest.fn(),
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
    expect(() => getByText(txt => txt.includes('name value'))).not.toThrow()
    expect(() => getByText(txt => txt.includes('spanish'))).not.toThrow()

    // should not render these values
    expect(() => getByText(txt => txt.includes('text value'))).toThrow()

    expect(() =>
      getByText(txt => txt.includes('pronunciation value')),
    ).toThrow()
    expect(() => getByText(txt => txt.includes('link value'))).toThrow()
  })

  it('filters when updating text', () => {
    const { container, getByText } = render(<RecordsList {...commonProps} />)

    expect(() => getByText(txt => txt.includes('name value'))).not.toThrow()

    // several filterings
    ;[
      ['name', true],
      ['FOO', false],
      ['name value', true],
      ['name FOO', false],
      ['name spanish', true],
    ].forEach(([value, shouldDisplayItem]) => {
      fireEvent.change(container.querySelector('input') as HTMLInputElement, {
        target: {
          value,
        },
      })

      const fn = () => getByText(txt => txt.includes('name value'))

      if (shouldDisplayItem) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(fn).not.toThrow()
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(fn).toThrow()
      }
    })
  })
})
