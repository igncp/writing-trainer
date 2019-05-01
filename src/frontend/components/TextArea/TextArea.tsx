import React from 'react'

type TTextArea = React.FC<{
  [key: string]: any
}>

const TextArea: TTextArea = ({ style, ...props }) => {
  return (
    <textarea
      style={{ width: '100%', outline: 0, resize: 'none', ...style }}
      data-gramm_editor={false}
      {...props}
    />
  )
}

export default TextArea
