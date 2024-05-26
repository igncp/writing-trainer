import { Record } from '#/core'

import { fireEvent, render } from '@testing-library/react'

import RecordsList from '../RecordsList'

const commonProps = {
  disabled: false,
  onRecordEdit: jest.fn(),
  onRecordLoad: jest.fn(),
  onRecordRemove: jest.fn(),
  onSongLoad: jest.fn(),
  records: [
    new Record({
      createdOn: Date.now(),
      id: '0',
      isRemote: false,
      language: 'spanish',
      lastLoadedOn: Date.now(),
      link: 'link value',
      name: 'name value',
      pronunciation: 'pronunciation value',
      text: 'text value',
    }),
  ],
  songs: [],
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
