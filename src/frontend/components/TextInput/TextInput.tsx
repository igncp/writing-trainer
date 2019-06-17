import React from 'react'

type TextInput = React.FC<
  {
    onEnterPress(): void
  } & React.InputHTMLAttributes<HTMLInputElement>
>

const TextInput: TextInput = ({ onEnterPress, onChange, value, ...props }) => {
  return (
    <input
      type="text"
      style={{
        border: 'none',
        borderBottom: '1px solid black',
        outline: 'none',
        padding: 5,
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
      {...props}
    />
  )
}

TextInput.defaultProps = {
  onEnterPress: () => {},
}

export default TextInput
