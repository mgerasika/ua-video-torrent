import { useEffect } from 'react'

export function useEncodeUrl(
  encoded_video_url: string,
  callback: (url: string) => void,
): void {
  useEffect(() => {
    let interval: unknown
    const fn = () => {
      if ((window as any).o.FGeRtNzK && (window as any).o.is_ready) {
        const url = (window as any).o.FGeRtNzK(encoded_video_url) as string
        callback(url)
      } else {
        interval = setTimeout(() => {
          fn()
        }, 0)
      }
    }
    fn()
    return () => clearTimeout(interval as any)
  }, [])
}
