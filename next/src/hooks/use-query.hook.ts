import { useEffect, useState } from 'react'

interface IReturn<T> {
  data: T | undefined
  error: any
  loading: boolean
}
export function useQuery<T >(callback: () => Promise<{data:T}>): IReturn<T> {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
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
  }, [callback])
  return {
    data,
    error,
    loading,
  }
}
