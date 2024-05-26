import { MainContextProvider } from '#/react-ui/containers/main-context'
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../web-app/components/global.scss'
import '../web-app/styles/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainContextProvider>
      <Component {...pageProps} />
      <ToastContainer theme="dark" />
    </MainContextProvider>
  )
}
