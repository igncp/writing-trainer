import 按鈕 from '../按鈕'

const ButtonStories = () => {
  return <按鈕 onClick={() => console.log('clicked')}>按鈕文字</按鈕>
}

const Template = () => <ButtonStories />

const Common = Template.bind({})

export default {
  component: ButtonStories,
  title: 'Components/按鈕',
}

export { Common }
