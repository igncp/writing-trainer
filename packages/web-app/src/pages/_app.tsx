import { AppProps } from 'next/app'

import '../components/global.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
