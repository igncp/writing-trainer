import React from 'react'

import OptionsBlock from '../OptionsBlock'

const OptionsBlockStories = () => {
  return (
    <OptionsBlock
      languageOptions={{}}
      onOptionsChange={() => console.log('options-change')}
    />
  )
}

const Template = () => <OptionsBlockStories />

const Common = Template.bind({})

export default {
  component: OptionsBlockStories,
  title: 'Languages/Cantonese/OptionsBlock',
}

export { Common }
