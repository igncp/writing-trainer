import React from 'react'

import PanelTrigger from '../PanelTrigger'

const PanelTriggerStories = () => {
  return <PanelTrigger onClick={() => {}} />
}

const Template = () => <PanelTriggerStories />

const Common = Template.bind({})

export default {
  component: PanelTriggerStories,
  title: 'Components/PanelTrigger',
}

export { Common }
