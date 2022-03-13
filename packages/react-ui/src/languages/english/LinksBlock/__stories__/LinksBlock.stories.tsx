import React from 'react'

import LinksBlock from '../LinksBlock'

const LinksBlockStories = () => {
  return <LinksBlock text="Sample English Text">LinksBlock Text</LinksBlock>
}

const Template = () => <LinksBlockStories />

const Common = Template.bind({})

export default {
  component: LinksBlockStories,
  title: 'Languages/English/LinksBlock',
}

export { Common }
