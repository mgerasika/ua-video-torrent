import { useCallback, useEffect, useId, useState } from 'react'

function load<T>(key: string): T | undefined {
  if (typeof window === 'undefined') {
    return
  }
  const data = window.localStorage.getItem(key)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return undefined
    }
  }
}
type IReturn<T> = [T, (newValue: T) => void]
export function useLocalStorageState<T>(key: string, initial: T): IReturn<T> {
  const [data, setData] = useState<T>(load(key) || initial)

  const handleSave = useCallback((newData: T) => {
    localStorage.setItem(key, JSON.stringify(newData))
    setData(newData)
  }, [])
  return [data, handleSave]
}
