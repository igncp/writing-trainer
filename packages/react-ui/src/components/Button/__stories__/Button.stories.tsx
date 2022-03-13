import React from 'react'

import Button from '../Button'

const ButtonStories = () => {
  return <Button onClick={() => console.log('clicked')}>Button Text</Button>
}

const Template = () => <ButtonStories />

const Common = Template.bind({})

export default {
  component: ButtonStories,
  title: 'Components/Button',
}

export { Common }
