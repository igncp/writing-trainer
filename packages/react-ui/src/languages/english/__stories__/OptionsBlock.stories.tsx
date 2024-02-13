import React from 'react'

import { action } from '@storybook/addon-actions'

import OptionsBlock from '../OptionsBlock'

const OptionsBlockStories = () => {
  return <OptionsBlock 更改語言選項={action('options-change')} 語言選項={{}} />
}

const Template = () => <OptionsBlockStories />

const Common = Template.bind({})

export default {
  component: OptionsBlockStories,
  title: 'Languages/English/OptionsBlock',
}

export { Common }
