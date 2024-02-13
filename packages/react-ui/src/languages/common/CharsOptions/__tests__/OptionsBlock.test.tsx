import React from 'react'

import { render } from '@testing-library/react'

import OptionsBlock from '../OptionsBlock'

const commonProps = {
  更改語言選項: () => {},
  語言選項: {},
}

describe('OptionsBlock', () => {
  it('renders the content', () => {
    const { getByText } = render(<OptionsBlock {...commonProps} />)

    expect(() => getByText('不要使用聲調')).not.toThrow()
    expect(() => getByText('使用聲調')).not.toThrow()
  })
})
