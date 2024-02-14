import React from 'react'

import { render } from '@testing-library/react'

import 連結區塊 from '../連結區塊'

const commonProps = {
  文字: 'F OO _B A R ',
}

describe('按鈕', () => {
  it('renders some dummy content', () => {
    const { getByText } = render(<連結區塊 {...commonProps} />)

    expect(() => getByText('Links Block')).toThrow()

    expect(() => getByText(commonProps.文字)).toThrow()
  })
})
