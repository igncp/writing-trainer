import _get from 'lodash/get'
import React, { useEffect, useRef } from 'react'

type TextArea = React.FC<
  {
    withoutCursor?: boolean
    autoScroll?: boolean
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
>

const TextArea: TextArea = ({
  style,
  withoutCursor,
  onChange,
  autoScroll,
  ...props
}) => {
  const ref = useRef()
  const color = _get(style, 'color', 'black')
  const cursorStyle = withoutCursor
    ? {
        color: 'transparent',
        textShadow: `0 0 0 ${color}`,
      }
    : {}

  useEffect(() => {
    if (autoScroll && ref.current) {
      // tslint:disable-next-line semicolon
      ;(ref as any).current.scrollTop! = (ref as any).current.scrollHeight!
    }
  })

  return (
    <textarea
      style={{
        outline: 0,
        resize: 'none',
        width: '100%',
        ...cursorStyle,
        ...style,
      }}
      onChange={onChange}
      spellCheck={false}
      data-gramm_editor={false}
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
