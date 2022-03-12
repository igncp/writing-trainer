import * as React from 'react'
import { LanguageDefinition } from 'writing-trainer-core'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import ChooseLanguage from '../ChooseLanguage'

const StoryComp = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState('mandarin')

  return (
    <ChooseLanguage
      languages={[
        new LanguageDefinition({
          id: 'mandarin',
          name: 'Mandarin',
        }),
        new LanguageDefinition({
          id: 'cantonese',
          name: 'Cantonese',
        }),
      ]}
      onOptionsChange={id => {
        setSelectedLanguage(id)
        action('options-change')(id)
      }}
      selectedLanguage={selectedLanguage}
    />
  )
}

storiesOf('Components|ChooseLanguage', module).add('common', () => {
  return <StoryComp />
})
