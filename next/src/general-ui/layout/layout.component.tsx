import Link from 'next/link'
import { ReactNode } from 'react'
import 'twin.macro'

interface IProps {
  showBack: boolean
  children: ReactNode
  title: ReactNode
}
export const Layout = ({ children, showBack, title }: IProps) => {
  return (
    <div >
      <div tw="mx-auto container">
        <div tw="flex lg:py-4 sticky top-0 bg-black z-10">
          {showBack && (
            <Link href="/" tw="cursor-pointer text-white pl-4 pr-2 flex items-center ">
              Back
            </Link>
          )}
            <h2 tw="text-white block text-[30px] text-center w-full text-ellipsis whitespace-nowrap overflow-hidden">
              {title}
            </h2>
            
        </div>

        {children}
      </div>
    </div>
  )
}
