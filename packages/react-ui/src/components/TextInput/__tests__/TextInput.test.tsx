import React from 'react'

import { fireEvent, render } from '@testing-library/react'

import TextInput from '../TextInput'

const commonProps = {
  onChange: () => {},
  onEnterPress: jest.fn(),
  value: 'textInputValue',
}

describe('TextInput', () => {
  it('renders the content', () => {
    const { container } = render(<TextInput {...commonProps} />)
    const el = container.querySelector('input')

    expect(el?.value).toEqual('textInputValue')
  })

  it('disables grammarly', async () => {
    const { baseElement } = render(<TextInput {...commonProps} />)

    expect(
      baseElement.querySelector('input')?.getAttribute('data-gramm_editor'),
    ).toEqual('false')
  })

  it('calls the expected method on Enter press', () => {
    const { baseElement } = render(<TextInput {...commonProps} />)

    const input = baseElement.querySelector('input') as HTMLInputElement

    fireEvent.keyPress(input, {
      charCode: 'A'.charCodeAt(0),
      code: 'A'.charCodeAt(0),
      key: 'A',
    })

    expect(commonProps.onEnterPress.mock.calls).toEqual([])

    fireEvent.keyPress(input, {
      charCode: 13,
      code: 13,
      key: 'Enter',
    })

    expect(commonProps.onEnterPress.mock.calls).toEqual([[]])
  })
})
