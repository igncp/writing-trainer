import { MainContextProvider } from '#/react-ui/containers/main-context'
import { AppProps } from 'next/app'

import '../web-app/components/global.scss'
import '../web-app/styles/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainContextProvider>
      <Component {...pageProps} />
    </MainContextProvider>
  )
}
