import TextInput from '../TextInput'

const TextInputStories = () => {
  return <TextInput onEnterPress={() => console.log('onEnterPress')} />
}

const Template = () => <TextInputStories />

const Common = Template.bind({})

export default {
  component: TextInputStories,
  title: 'Components/TextInput',
}

export { Common }
