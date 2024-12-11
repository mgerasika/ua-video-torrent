import { useEffect, useRef } from 'react'

export const useIsMounted = (): boolean => {
  const b = useRef<boolean>(true)
  useEffect(() => {
    b.current = true
    return () => {
      b.current = false
    }
  }, [])
  return b.current
}
