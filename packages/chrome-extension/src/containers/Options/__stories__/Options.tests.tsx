import React from 'react'

import { fireEvent, render, waitFor } from '@testing-library/react'

import mockStorage from '@/services/storage'
import { STORAGE_ENABLED_PAGES_KEY } from '@/utils/constants'

import Options from '../Options'

jest.mock('@/services/storage', () => ({
  getValue: jest.fn(),
  setValue: jest.fn(),
}))

const commonProps = {}

describe('Options', () => {
  it('renders the content', async () => {
    const { container, getByText } = render(<Options {...commonProps} />)

    await waitFor(() =>
      getByText((txt: string) => txt.includes('Pages where it is enabled')),
    )

    expect(() =>
      getByText(txt => txt.includes('Pages where it is enabled')),
    ).not.toThrow()
    expect(container.querySelectorAll('textarea')).toHaveLength(1)
  })

  it('saves content in storage when click', async () => {
    const { container, getByText } = render(<Options {...commonProps} />)

    await waitFor(() =>
      getByText((txt: string) => txt.includes('Pages where it is enabled')),
    )

    expect((mockStorage.setValue as jest.Mock).mock.calls).toEqual([])

    fireEvent.change(
      container.querySelector('textarea') as HTMLTextAreaElement,
      {
        target: {
          value: 'textValue',
        },
      },
    )

    const button = getByText('Save')
    fireEvent.click(button)

    expect((mockStorage.setValue as jest.Mock).mock.calls).toEqual([
      [STORAGE_ENABLED_PAGES_KEY, 'textValue'],
    ])
  })
})
