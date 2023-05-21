import { useEffect, useRef } from 'react'

export const useIsBrowser = (): boolean => {
  const b = useRef<boolean>(true)
  useEffect(() => {
    if (typeof window !== undefined) {
      b.current = true
    }
  }, [])
  return b.current
}
