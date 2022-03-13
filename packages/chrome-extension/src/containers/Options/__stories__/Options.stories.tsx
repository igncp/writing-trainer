import * as React from 'react'

import Options from '../Options'

const OptionsStories = () => {
  return <Options />
}

const Template = () => <OptionsStories />

const Common = Template.bind({})

export default {
  component: OptionsStories,
  title: 'Containers/Options',
}

export { Common }
