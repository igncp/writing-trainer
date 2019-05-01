import { useEffect, useState } from 'react'

import { getSelectedText } from './general'

export const useTextSelection = fn => {
  useEffect(() => {
    const listener = () => {
      const selectedText = getSelectedText()

      fn(selectedText || '')
    }
    document.body.addEventListener('mouseup', listener)

    return () => {
      document.body.removeEventListener('mouseup', listener)
    }
  }, [])
}

// https://github.com/beizhedenglong/react-hooks-lib
export const useHover = () => {
  const [hovered, set] = useState(false)

  return {
    bind: {
      onMouseEnter: () => set(true),
      onMouseLeave: () => set(false),
    },
    hovered,
  }
}
