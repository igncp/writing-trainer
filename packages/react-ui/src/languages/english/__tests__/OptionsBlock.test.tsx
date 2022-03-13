import React from 'react'

import { render } from '@testing-library/react'

import OptionsBlock from '../OptionsBlock'

const commonProps = {
  languageOptions: {},
  onOptionsChange: () => {},
}

describe('OptionsBlock', () => {
  it('renders some dummy content', () => {
    const { getByText } = render(<OptionsBlock {...commonProps} />)

    expect(() => getByText('Options Block')).not.toThrow()
  })
})
