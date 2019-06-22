import React from 'react'
import { render } from 'react-testing-library'

import PanelBase from '../PanelBase'

const commonProps = {
  children: 'Test Content',
  onOverlayClick: () => {},
}

describe('PanelBase', () => {
  it('renders the content', () => {
    const { getByText } = render(<PanelBase {...commonProps} />)

    expect(() => getByText('Test Content')).not.toThrow()
  })
})
