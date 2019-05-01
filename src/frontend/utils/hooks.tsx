import { useEffect, useState } from 'react'

import { getSelectedText } from './general'

export const useTextSelection = () => {
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    const listener = () => {
      const selectedText = getSelectedText()

      setIsSelected(selectedText !== '')
    }
    document.body.addEventListener('mouseup', listener)

    return () => {
      document.body.removeEventListener('mouseup', listener)
    }
  }, [])

  return [isSelected]
}
