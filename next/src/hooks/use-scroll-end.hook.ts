import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface IProps {
  onScrollTop?: () => void
  onScrollEnd?: () => void
}

interface IReturn {
  scrollY:number;
}
export const useScrollEnd = ({ onScrollTop, onScrollEnd }: IProps): IReturn => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const scrollBottom =
        window.document.documentElement.offsetHeight -
        (window.scrollY + window.document.documentElement.clientHeight)

      if (scrollBottom <= 5) {
        onScrollEnd && onScrollEnd()
      } else if (window.scrollY === 0) {
        onScrollTop && onScrollTop()
      }
    }

    window.addEventListener('scroll', handleScroll)

    // clean up the observer when the component unmounts
    return (): void => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [onScrollEnd, onScrollTop])

  return {scrollY};
}
