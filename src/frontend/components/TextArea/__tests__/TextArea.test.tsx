import React from 'react'
import { render, waitForElement } from 'react-testing-library'

import TextArea from '../TextArea'

describe('TextArea', () => {
  it('renders the content', () => {
    const { getByText } = render(
      <TextArea rows={1} value={'Test Content'} onChange={() => {}} />
    )

    expect(() => getByText('Test Content')).not.toThrow()
  })

  it('disables grammarly', async () => {
    const { getByText, baseElement } = render(
      <TextArea rows={1} value={'Test Content'} onChange={() => {}} />
    )

    await waitForElement(() => getByText('Test Content'))

    const textAreaEl = baseElement.querySelector('textarea')

    expect(textAreaEl.getAttribute('data-gramm_editor')).toEqual('false')
  })
})
