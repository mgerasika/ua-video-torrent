import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface IProps {
  onScrollTop?: () => void
  onScrollEnd?: () => void
}
export const useScrollEnd = ({ onScrollTop, onScrollEnd }: IProps) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom =
        window.document.documentElement.offsetHeight -
        (window.scrollY + window.document.documentElement.clientHeight)

      if (scrollBottom <= 2) {
        onScrollEnd && onScrollEnd()
      } else if (window.scrollY === 0) {
        onScrollTop && onScrollTop()
      }
    }

    console.log('subscripte on scroll')
    window.addEventListener('scroll', handleScroll)

    // clean up the observer when the component unmounts
    return (): void => {
      console.log('unsubscribe scroll')
      window.removeEventListener('scroll', handleScroll)
    }
  }, [onScrollEnd, onScrollTop])
}
