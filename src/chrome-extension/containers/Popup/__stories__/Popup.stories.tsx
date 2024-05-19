import Popup from '../Popup'

const onClick = () => {}

const PopupStories = () => {
  return <Popup onEnableOnceClick={onClick} onOptionsPageClick={onClick} />
}

const Template = () => <PopupStories />

const Common = Template.bind({})

export default {
  component: PopupStories,
  title: 'Containers/Popup',
}

export { Common }
