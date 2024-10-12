import { useCallback, useEffect, useState } from 'react'

interface IReturn<T> {
  data: T | undefined
  error: any
  loading: boolean
  execute: () => void
}
export function useMutation<T>(
  callback: () => Promise<{ data: T }>,
): IReturn<T> {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const execute = useCallback(() => {
    setLoading(true)
    callback()
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        setError(err)
      })
  }, [])
  return {
    data,
    error,
    loading,
    execute,
  }
}
