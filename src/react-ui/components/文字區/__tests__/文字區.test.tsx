import { render, waitFor } from '@testing-library/react'

import 文字區 from '../文字區'

describe('文字區', () => {
  it('renders the content', () => {
    const { getByText } = render(
      <文字區 onChange={() => {}} rows={1} value={'Test Content'} />,
    )

    expect(() => getByText('Test Content')).not.toThrow()
  })

  it('disables grammarly', async () => {
    const { baseElement, getByText } = render(
      <文字區 onChange={() => {}} rows={1} value={'Test Content'} />,
    )

    await waitFor(() => getByText('Test Content'))

    const textAreaEl = baseElement.querySelector('textarea')

    expect(textAreaEl?.getAttribute('data-gramm_editor')).toEqual('false')
  })
})
