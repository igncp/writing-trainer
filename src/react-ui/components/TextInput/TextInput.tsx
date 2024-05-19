import { InputHTMLAttributes, RefObject } from 'react'

type Props = {
  inputRef?: RefObject<HTMLInputElement>
  onEnterPress: () => void
}

type IProps = InputHTMLAttributes<HTMLInputElement> & Props

const TextInput = ({
  inputRef,
  onChange,
  onEnterPress,
  style,
  value,
  ...props
}: IProps) => {
  return (
    <input
      data-gramm_editor={false}
      onChange={onChange}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          onEnterPress()
        }
      }}
      ref={inputRef ?? null}
      spellCheck={false}
      style={{
        border: 'none',
        borderBottom: '1px solid #777',
        outline: 'none',
        padding: 5,
        ...style,
      }}
      type="text"
      value={value}
      {...props}
    />
  )
}

TextInput.defaultProps = {
  onEnterPress: () => {},
  style: {},
}

export default TextInput
