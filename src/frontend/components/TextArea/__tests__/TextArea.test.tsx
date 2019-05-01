import React from 'react'
import { render } from 'react-testing-library'

import TextArea from '../TextArea'

describe('TextArea', () => {
  it('renders the content', () => {
    const { getByText } = render(
      <TextArea rows={1} value={'Test Content'} onChange={() => null} />
    )

    expect(() => getByText('Test Content')).not.toThrow()
  })
})
