import React from 'react'

import { render } from '@testing-library/react'

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
