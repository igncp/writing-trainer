import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import ChooseLanguage from '../ChooseLanguage'

const StoryComp = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState('mandarin')

  return (
    <ChooseLanguage
      languages={[
        {
          id: 'mandarin',
          name: 'Mandarin',
        },
        {
          id: 'cantonese',
          name: 'Cantonese',
        },
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
