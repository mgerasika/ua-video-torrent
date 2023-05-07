import type { AppProps } from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'
import 'twin.macro'

const App = ({ Component, pageProps }: AppProps) => (
  <div tw="bg-black min-h-screen">
    <GlobalStyles />
    <Component {...pageProps} />
  </div>
)

export default App
