import { ReactNode, useCallback } from 'react'
import tw from 'twin.macro'

interface IProps {
  css?: any
  children: ReactNode
  className?: string
  onClick?: () => void
}
export const StatusTag = ({
  children,
  className,
  onClick,
}: IProps): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className={className}
      tw="text-white [font-size: medium] [border-radius: 6px] bg-black px-2 py-0 border-solid border-white [border-width: 1px] lowercase font-light"
    >
      {children}
    </div>
  )
}
