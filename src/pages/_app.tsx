import { MainContextProvider } from '#/react-ui/containers/main-context'
import { LangProvider } from '#/utils/i18n'
import { TOOLTIP_ID } from '#/utils/tooltip'
import { AppProps } from 'next/app'
import { PropsWithChildren, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

import '../web-app/components/global.scss'
import '../web-app/styles/global.css'

const NoSSR = ({ children }: PropsWithChildren) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? children : null
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainContextProvider>
      <LangProvider>
        <Component {...pageProps} />
      </LangProvider>
      <NoSSR>
        <ToastContainer theme="dark" />
        <Tooltip id={TOOLTIP_ID} />
      </NoSSR>
    </MainContextProvider>
  )
}
