import React from 'react'
import { LanguageDefinition } from 'writing-trainer-core'

import ChooseLanguage from '../ChooseLanguage'

const ChooseLanguageStories = () => {
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
        console.log('options-change', id)
      }}
      selectedLanguage={selectedLanguage}
    />
  )
}

const Template = () => <ChooseLanguageStories />

const Common = Template.bind({})

export default {
  component: ChooseLanguageStories,
  title: 'Components/ChooseLanguage',
}

export { Common }
