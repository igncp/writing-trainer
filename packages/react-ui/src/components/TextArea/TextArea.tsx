import _get from 'lodash/get'
import React, { useEffect, useRef } from 'react'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  autoScroll?: boolean
  setRef?: (ref: HTMLTextAreaElement | null) => void
  withoutCursor?: boolean
}

const TextArea = ({
  autoScroll,
  onChange,
  setRef,
  style,
  withoutCursor,
  ...props
}: TextAreaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const color = _get(style, 'color', 'var(--color-text, "black")')
  const cursorStyle = withoutCursor
    ? {
        color: 'transparent',
        textShadow: `0 0 0 ${color}`,
      }
    : {}

  if (setRef) {
    setRef(ref.current)
  }

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  })

  return (
    <textarea
      data-gramm_editor={false}
      onChange={onChange}
      ref={ref}
      spellCheck={false}
      style={{
        border: '1px solid var(--color-background)',
        outline: 0,
        resize: 'none',
        width: '100%',

        ...cursorStyle,
        ...style,
      }}
      {...props}
    />
  )
}

TextArea.defaultProps = {
  autoScroll: false,
}

export default TextArea
