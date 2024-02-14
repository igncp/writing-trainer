import React from 'react'

import 連結區塊 from '../連結區塊'

const 連結區塊故事 = () => {
  return (
    <div>
      <p>The links block for japanese is empty at the moment</p>
      <連結區塊
        文字="崩比筆,壁必畢.閉編"
        文字片段列表={{ 列表: [], 索引: 0 }}
        更改文字片段列表={() => {}}
      >
        連結區塊文字
      </連結區塊>
    </div>
  )
}

const Template = () => <連結區塊故事 />

const Common = Template.bind({})

export default {
  component: 連結區塊故事,
  title: 'Components/連結區塊',
}

export { Common }
