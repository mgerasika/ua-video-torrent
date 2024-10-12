import { ReactNode } from 'react'
import 'twin.macro'

interface IProps {
  loading: boolean
  children: ReactNode
}
export const Loading = ({ loading, children }: IProps) => {
  return (
    <div>
      {loading && (
        <>
          <div tw="w-full opacity-70 h-full flex bg-black z-40 absolute"></div>
          <div tw="w-full flex items-center z-50 text-2xl h-screen text-white absolute m-auto justify-center">
            Loading...
          </div>
        </>
      )}

      {children}
    </div>
  )
}
