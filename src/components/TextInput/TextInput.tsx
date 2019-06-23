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
      type="text"
      style={{
        border: 'none',
        borderBottom: '1px solid #777',
        outline: 'none',
        padding: 5,
        ...style,
      }}
      onChange={onChange}
      spellCheck={false}
      data-gramm_editor={false}
      value={value}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          onEnterPress()
        }
      }}
      ref={inputRef || null}
      {...props}
    />
  )
}

TextInput.defaultProps = {
  onEnterPress: () => {},
  style: {},
}

export default TextInput
