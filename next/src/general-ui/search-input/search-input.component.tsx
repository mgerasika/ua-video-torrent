import { useCallback, useEffect, useRef, useState } from 'react'
import 'twin.macro'
import { useIsMounted } from '../../hooks/use-is-mounted.hook'
import { CloseOutlined } from '@ant-design/icons'

interface IProps {
  className?: string
  text: string
  onTextChange: (text: string) => void
}
export const SearchInput = ({ className, onTextChange, ...rest }: IProps) => {
  const [text, setText] = useState(rest.text)

  useEffect(() => {
    setText(rest.text)
  }, [rest.text])

  const isMounted = useIsMounted()

  const intervalRef = useRef<any>()
  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value)

      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current)
      }
      intervalRef.current = setTimeout(() => {
        if (isMounted) {
          onTextChange(e.target.value)
        }
      }, 800)
    },
    [text, onTextChange],
  )
	
	const handleCloseClick = useCallback(() => {
		onTextChange('')
	}, [onTextChange]);
	
  return (
    <div tw=" relative text-white" className={className}>
      <input
        placeholder="enter search text here"
        type="text"
        tw="[border-radius: 6px] w-full text-black outline-none px-2 py-1"
        value={text}
        onChange={handleSearchTextChange}
      />
      <div tw="text-black absolute right-2 top-1" onClick={handleCloseClick}><CloseOutlined /></div>
    </div>
  )
}
