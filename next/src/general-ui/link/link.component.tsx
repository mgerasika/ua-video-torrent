import NextLink from 'next/link'
import { ReactNode, useCallback } from 'react'
import tw from 'twin.macro'

interface IProps {
  css?: any
  href: string
  children: ReactNode
  className?: string
}
export const Link = ({ href, children, className }: IProps): JSX.Element => {
  return (
    <NextLink
		  href={href}
      className={className}
      tw="text-white [font-size: medium] underline font-light  underline-offset-4"
    >
      {children}
    </NextLink>
  )
}
