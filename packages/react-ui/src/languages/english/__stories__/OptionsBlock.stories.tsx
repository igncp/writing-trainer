import React from 'react'

import { action } from '@storybook/addon-actions'

import OptionsBlock from '../OptionsBlock'

const OptionsBlockStories = () => {
  return (
    <OptionsBlock
      languageOptions={{}}
      onOptionsChange={action('options-change')}
    />
  )
}

const Template = () => <OptionsBlockStories />

const Common = Template.bind({})

export default {
  component: OptionsBlockStories,
  title: 'Languages/Mandarin/OptionsBlock',
}

export { Common }
