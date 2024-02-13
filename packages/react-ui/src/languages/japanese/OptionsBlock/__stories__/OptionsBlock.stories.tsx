import React from 'react'

import OptionsBlock from '../OptionsBlock'

const OptionsBlockStories = () => {
  return (
    <div>
      <p>The options block for Japanese is empty at the moment</p>
      <OptionsBlock
        更改語言選項={() => console.log('更改語言選項')}
        語言選項={{}}
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
