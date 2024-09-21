import { useEffect, useRef } from 'react'

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
