import { useEffect } from 'react'

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
