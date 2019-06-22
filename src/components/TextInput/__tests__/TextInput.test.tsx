import React from 'react'
import { render } from 'react-testing-library'

import TextInput from '../TextInput'

const commonProps = {
  onChange: () => {},
  onEnterPress: () => {},
  value: 'textInputValue',
}

describe('TextInput', () => {
  it('renders the content', () => {
    const { container } = render(<TextInput {...commonProps} />)
    const el = container.querySelector('input')

    expect(el.value).toEqual('textInputValue')
  })
})
