import React from 'react'

import { render } from '@testing-library/react'

import OptionsBlock from '../OptionsBlock'

const commonProps = {
  languageOptions: {},
  onOptionsChange: () => {},
}

describe('OptionsBlock', () => {
  it('renders the content', () => {
    const { getByText } = render(<OptionsBlock {...commonProps} />)

    expect(() => getByText('Without Tones')).not.toThrow()
    expect(() => getByText('With Tones')).not.toThrow()
  })
})
