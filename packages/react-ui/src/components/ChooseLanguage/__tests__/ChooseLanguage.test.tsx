import React from 'react'
import { render } from 'react-testing-library'
import { LanguageDefinition } from 'writing-trainer-core'

import ChooseLanguage from '../ChooseLanguage'

const commonProps = {
  languages: [
    new LanguageDefinition({
      id: 'mandarin',
      name: 'Mandarin',
    }),
    new LanguageDefinition({
      id: 'cantonese',
      name: 'Cantonese',
    }),
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
