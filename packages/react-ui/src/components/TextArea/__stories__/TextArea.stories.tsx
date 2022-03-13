import React from 'react'

import TextArea from '../TextArea'

const TextAreaStories = () => {
  return <TextArea rows={1}>Content</TextArea>
}

const Template = () => <TextAreaStories />

const Common = Template.bind({})

export default {
  component: TextAreaStories,
  title: 'Components/TextArea',
}

export { Common }
