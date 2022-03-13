import * as React from 'react'

import Content from '../Content'

const onClick = () => {}

const ContentStories = () => {
  return (
    <div>
      <p>Some text to select</p>
      <Content onContentEnabledResult={onClick} />
    </div>
  )
}

const Template = () => <ContentStories />

const Common = Template.bind({})

export default {
  component: ContentStories,
  title: 'Containers/Content',
}

export { Common }
