import React from 'react'

import 連結區塊 from '../連結區塊'

const 連結區塊故事 = () => {
  return <連結區塊 文字="崩比筆,壁必畢.閉編">連結區塊文字</連結區塊>
}

const Template = () => <連結區塊故事 />

const Common = Template.bind({})

export default {
  component: 連結區塊故事,
  title: 'Languages/Mandarin/連結區塊',
}

export { Common }
