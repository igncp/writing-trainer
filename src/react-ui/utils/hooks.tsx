import { useEffect, useRef, useState } from 'react'

import { getSelectedText } from './general'

export const useTextSelection = (
  isExtensionEnabled: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: any,
): void => {
  useEffect(() => {
    if (!isExtensionEnabled) {
      return () => {}
    }

    const listener = () => {
      const selectedText = getSelectedText()

      fn(selectedText || '')
    }

    document.body.addEventListener('mouseup', listener)

    return () => {
      document.body.removeEventListener('mouseup', listener)
    }
  }, [isExtensionEnabled, fn])
}

// https://github.com/beizhedenglong/react-hooks-lib
export const useHover = () => {
  const [hovered, set] = useState(false)

  return {
    bind: {
      onMouseEnter: () => {
        set(true)
      },
      onMouseLeave: () => {
        set(false)
      },
    },
    hovered,
  }
}

export const useBodyOverflowSwitch = (switchValue: boolean): void => {
  const bodyOverflow = useRef<string>('')

  useEffect(() => {
    if (switchValue) {
      bodyOverflow.current = document.body.style.overflow || ''
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = bodyOverflow.current || ''
    }
  }, [switchValue])
}
