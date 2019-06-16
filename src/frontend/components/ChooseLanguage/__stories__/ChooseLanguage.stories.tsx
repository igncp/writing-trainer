import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import ChooseLanguage from '../ChooseLanguage'

const StoryComp = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState('mandarin')

  return (
    <ChooseLanguage
      onOptionsChange={id => {
        setSelectedLanguage(id)
        action('options-change')(id)
      }}
      selectedLanguage={selectedLanguage}
      languages={[
        {
          id: 'mandarin',
          text: 'Mandarin',
        },
        {
          id: 'cantonese',
          text: 'Cantonese',
        },
      ]}
    />
  )
}

storiesOf('Components|ChooseLanguage', module).add('common', () => {
  return <StoryComp />
})
