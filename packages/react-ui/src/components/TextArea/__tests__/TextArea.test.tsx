import React from 'react'
import { render, waitForElement } from 'react-testing-library'

import TextArea from '../TextArea'

describe('TextArea', () => {
  it('renders the content', () => {
    const { getByText } = render(
      <TextArea onChange={() => {}} rows={1} value={'Test Content'} />
    )

    expect(() => getByText('Test Content')).not.toThrow()
  })

  it('disables grammarly', async () => {
    const { getByText, baseElement } = render(
      <TextArea onChange={() => {}} rows={1} value={'Test Content'} />
    )

    await waitForElement(() => getByText('Test Content'))

    const textAreaEl = baseElement.querySelector('textarea')

    expect(textAreaEl.getAttribute('data-gramm_editor')).toEqual('false')
  })
})
