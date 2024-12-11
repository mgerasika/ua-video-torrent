import { useEffect } from "react"

export const useRestoreScroll = () =>{
    useEffect(() => {
        let interval = 0
        const handleScroll = () => {
          interval = window.setTimeout(() => {
            window.sessionStorage.setItem('scrollTop', window.scrollY + '')
          }, 500)
        }
    
        window.addEventListener('scroll', handleScroll)
    
        return (): void => {
          window.clearTimeout(interval)
          window.removeEventListener('scroll', handleScroll)
        }
      }, [])
      
    useEffect(() => {
        const interval = setTimeout(() => {
          const position = window.sessionStorage.getItem('scrollTop')
          if (position) {
            window.scrollTo({ left: 0, top: +position || 0 })
          }
        })
        return () => window.clearInterval(interval)
      }, [400])
}