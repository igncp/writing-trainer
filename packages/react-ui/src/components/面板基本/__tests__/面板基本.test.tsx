import React from 'react'

import { render } from '@testing-library/react'

import 面板基本 from '../面板基本'

const commonProps = {
  children: 'Test Content',
  覆蓋點擊: () => {},
}

describe('面板基本', () => {
  it('renders the content', () => {
    const { getByText } = render(<面板基本 {...commonProps} />)

    expect(() => getByText('Test Content')).not.toThrow()
  })
})
