import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { STORAGE_ENABLED_PAGES_KEY } from '#/utils/constants'

const mockStorage = {
  getValue: jest.fn(),
  setValue: jest.fn(),
}

jest.mock('#/services/storage', () => mockStorage)

import Options from '../Options'

const commonProps = {}

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Options', () => {
  it('renders the content', async () => {
    const { getByText, container } = render(<Options {...commonProps} />)

    await waitFor(() =>
      getByText((txt: string) => /Pages where it is enabled/.test(txt))
    )

    expect(() =>
      getByText((txt) => /Pages where it is enabled/.test(txt))
    ).not.toThrow()
    expect(container.querySelectorAll('textarea')).toHaveLength(1)
  })

  it('saves content in storage when click', async () => {
    const { container, getByText } = render(<Options {...commonProps} />)

    await waitFor(() =>
      getByText((txt: string) => /Pages where it is enabled/.test(txt))
    )

    expect(mockStorage.setValue.mock.calls).toEqual([])

    fireEvent.change(container.querySelector('textarea'), {
      target: {
        value: 'textValue',
      },
    })

    const button = getByText('Save')
    fireEvent.click(button)

    expect(mockStorage.setValue.mock.calls).toEqual([
      [STORAGE_ENABLED_PAGES_KEY, 'textValue'],
    ])
  })
})
