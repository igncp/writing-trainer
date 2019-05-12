import _get from 'lodash/get'
import React from 'react'

type TTextArea = React.FC<
  {
    withoutCursor?: boolean
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
>

const TextArea: TTextArea = ({ style, withoutCursor, ...props }) => {
  const color = _get(style, 'color', 'black')
  const cursorStyle = withoutCursor
    ? {
        color: 'transparent',
        textShadow: `0 0 0 ${color}`,
      }
    : {}

  return (
    <textarea
      style={{
        outline: 0,
        resize: 'none',
        width: '100%',
        ...cursorStyle,
        ...style,
      }}
      spellCheck={false}
      data-gramm_editor={false}
      {...props}
    />
  )
}

TextArea.defaultProps = {
  color: 'black',
}

export default TextArea
