import React from 'react'

import LinksBlock from '../LinksBlock'

const LinksBlockStories = () => {
  return (
    <div>
      <p>The links block for japanese is empty at the moment</p>
      <LinksBlock text="崩比筆,壁必畢.閉編">LinksBlock Text</LinksBlock>
    </div>
  )
}

const Template = () => <LinksBlockStories />

const Common = Template.bind({})

export default {
  component: LinksBlockStories,
  title: 'Components/LinksBlock',
}

export { Common }
