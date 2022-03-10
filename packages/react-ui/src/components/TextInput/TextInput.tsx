import React from 'react'

type TextInput = React.FC<
  {
    onEnterPress(): void
    inputRef?: React.RefObject<HTMLInputElement>
  } & React.InputHTMLAttributes<HTMLInputElement>
>

const TextInput: TextInput = ({
  onEnterPress,
  onChange,
  value,
  style,
  inputRef,
  ...props
}) => {
  return (
    <input
      data-gramm_editor={false}
      onChange={onChange}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onEnterPress()
        }
      }}
      ref={inputRef || null}
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
