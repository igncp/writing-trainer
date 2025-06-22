import { useEffect, useRef, useState } from 'react'

export const useEffectLater = (fn: () => void, deps: unknown[]) => {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true

      return
    }

    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const listener = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    listener()

    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])

  return isMobile
}
