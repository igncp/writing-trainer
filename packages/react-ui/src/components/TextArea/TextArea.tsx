import _get from 'lodash/get'
import React, { useEffect, useRef } from 'react'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  withoutCursor?: boolean
  autoScroll?: boolean
}

const TextArea = ({
  style,
  withoutCursor,
  onChange,
  autoScroll,
  ...props
}: TextAreaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const color = _get(style, 'color', 'black')
  const cursorStyle = withoutCursor
    ? {
        color: 'transparent',
        textShadow: `0 0 0 ${color}`,
      }
    : {}

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  })

  return (
    <textarea
      data-gramm_editor={false}
      onChange={onChange}
      spellCheck={false}
      style={{
        outline: 0,
        resize: 'none',
        width: '100%',
        ...cursorStyle,
        ...style,
      }}
      {...props}
      ref={ref}
    />
  )
}

TextArea.defaultProps = {
  autoScroll: false,
  color: 'black',
}

export default TextArea
