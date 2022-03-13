import React from 'react'

import OptionsBlock from '../OptionsBlock'

const OptionsBlockStories = () => {
  return (
    <div>
      <p>The options block for Japanese is empty at the moment</p>
      <OptionsBlock
        languageOptions={{}}
        onOptionsChange={() => console.log('onOptionsChange')}
      />
    </div>
  )
}

const Template = () => <OptionsBlockStories />

const Common = Template.bind({})

export default {
  component: OptionsBlockStories,
  title: 'Languages/Japanese/OptionsBlock',
}

export { Common }
