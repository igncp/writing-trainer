import 文字區 from '../文字區'

const 文本區故事 = () => {
  return <文字區 rows={1}>內容</文字區>
}

const Template = () => <文本區故事 />

const Common = Template.bind({})

export default {
  component: 文本區故事,
  title: 'Components/文字區',
}

export { Common }
