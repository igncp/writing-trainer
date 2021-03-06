import React from 'react'
import { render } from 'react-testing-library'

import ChooseLanguage from '../ChooseLanguage'

const commonProps = {
  languages: [
    {
      id: 'mandarin',
      name: 'Mandarin',
    },
    {
      id: 'cantonese',
      name: 'Cantonese',
    },
  ],
  onOptionsChange: () => {},
  selectedLanguage: 'cantonese',
}

describe('ChooseLanguage', () => {
  it('renders the content', () => {
    const { getByText } = render(<ChooseLanguage {...commonProps} />)

    expect(() => getByText('Mandarin')).not.toThrow()
    expect(() => getByText('Cantonese')).not.toThrow()
  })
})
