import React from 'react'

import { render } from '@testing-library/react'

import LinksBlock from '../LinksBlock'

const commonProps = {
  text: 'F OO _B A R ',
}

describe('按鈕', () => {
  it('renders some dummy content', () => {
    const { getByText } = render(<LinksBlock {...commonProps} />)

    expect(() => getByText('Links Block')).toThrow()

    expect(() => getByText(commonProps.text)).toThrow()
  })
})
