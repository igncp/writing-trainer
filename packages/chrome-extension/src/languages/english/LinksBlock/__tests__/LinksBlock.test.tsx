import React from 'react'
import { render } from 'react-testing-library'

import LinksBlock from '../LinksBlock'

const commonProps = {
  text: 'F OO _B A R ',
}

describe('Button', () => {
  it('renders some dummy content', () => {
    const { getByText } = render(<LinksBlock {...commonProps} />)

    expect(() => getByText('Links Block')).not.toThrow()

    expect(() => getByText(commonProps.text)).toThrow()
  })
})
