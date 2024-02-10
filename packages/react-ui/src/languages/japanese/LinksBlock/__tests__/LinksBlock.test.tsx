import React from 'react'

import { render } from '@testing-library/react'

import LinksBlock from '../LinksBlock'

const commonProps = {
  text: 'F OO _B A R ',
}

describe('按鈕', () => {
  it('renders the content', () => {
    const { getByText } = render(<LinksBlock {...commonProps} />)

    expect(() => getByText('Google Translate')).not.toThrow()

    expect(() => getByText(commonProps.text)).toThrow()
  })

  it('uses the expected Google Translate link', () => {
    const { getByText } = render(<LinksBlock {...commonProps} />)
    const el = getByText('Google Translate')
    const href = el.getAttribute('href') as string

    expect(href).toEqual('https://translate.google.com/#ja/en/FOO_BAR')
  })
})
