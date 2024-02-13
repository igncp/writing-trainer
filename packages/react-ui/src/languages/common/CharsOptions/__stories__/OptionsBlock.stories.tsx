import React from 'react'

import OptionsBlock from '../OptionsBlock'

const OptionsBlockStories = () => {
  return (
    <OptionsBlock
      更改語言選項={() => console.log('更改語言選項')}
      語言選項={{}}
    />
  )
}

const Template = () => <OptionsBlockStories />

const Common = Template.bind({})

export default {
  component: OptionsBlockStories,
  title: 'Languages/CharsOptions/OptionsBlock',
}

export { Common }
