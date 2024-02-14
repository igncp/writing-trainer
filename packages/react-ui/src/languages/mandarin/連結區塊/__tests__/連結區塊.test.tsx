import React from 'react'

import { render } from '@testing-library/react'

import 連結區塊 from '../連結區塊'

const commonProps = {
  文字: 'F OO _B A R ',
  文字片段列表: { 列表: [], 索引: 0 },
  更改文字片段列表: () => {},
}

describe('按鈕', () => {
  it('renders the content', () => {
    const { getByText } = render(<連結區塊 {...commonProps} />)

    expect(() => getByText('Google Translate')).not.toThrow()
    expect(() => getByText('發音')).not.toThrow()

    expect(() => getByText(commonProps.文字)).toThrow()
  })

  it('uses the expected Google Translate link', () => {
    const { getByText } = render(<連結區塊 {...commonProps} />)
    const el = getByText('Google Translate')
    const href = el.getAttribute('href') as string

    expect(href).toEqual('https://translate.google.com/#zh-CN/en/FOO_BAR')
  })
})
