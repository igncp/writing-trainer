import React from 'react'

import LinksBlock from '../LinksBlock'

const LinksBlockStories = () => {
  return <LinksBlock text="崩比筆,壁必畢.閉編">LinksBlock Text</LinksBlock>
}

const Template = () => <LinksBlockStories />

const Common = Template.bind({})

export default {
  component: LinksBlockStories,
  title: 'Languages/Cantonese/LinksBlock',
}

export { Common }
