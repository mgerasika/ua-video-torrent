import type { AppProps } from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'
import 'twin.macro'
import Head from 'next/head'
import { css } from 'twin.macro'

const App = ({ Component, pageProps }: AppProps) => (
  <div tw="min-h-screen" css={css`background-color:#5e2750`}>
    <GlobalStyles />
    <Component {...pageProps} />
  </div>
)

export default App
