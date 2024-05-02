import { AppProps } from 'next/app'

import '../components/global.scss'
import '../styles/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
