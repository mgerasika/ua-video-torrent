import type { AppProps } from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'
import 'twin.macro'
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => (
  <div tw="bg-black min-h-screen">
    <GlobalStyles />
    <Component {...pageProps} />
  </div>
)

export default App
