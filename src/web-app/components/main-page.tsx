import { Panel } from '#/react-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import {
  languageManager,
  languageUIManager,
  panelServices,
  usedText,
} from '../utils'

const PANEL_UI = {
  noHideButton: true,
}

const IndexPage = () => {
  const [theme, setTheme] = useState('dark')

  const { query } = useRouter()

  useEffect(() => {
    if (theme) {
      document.body.setAttribute('data-theme', theme)
      document.cookie = `theme=${theme};path=/`
    }
  }, [theme])

  return (
    <div>
      <Head>
        <title>Writing Trainer</title>
      </Head>
      <h1 className="mx-[0] my-[16px] flex flex-row items-center justify-center gap-[1rem] text-[10px] md:text-[20px]">
        Writing Trainer
      </h1>
      <div className="relative px-[8px] md:px-[16px]">
        <Panel
          UI={PANEL_UI}
          initialFragmentIndex={
            query.fragmentIndex ? Number(query.fragmentIndex) : undefined
          }
          languageManager={languageManager}
          languageUIManager={languageUIManager}
          services={panelServices}
          text={usedText}
          關於改變主題={() => {
            setTheme(theme === 'light' ? 'dark' : 'light')
          }}
        />
      </div>
    </div>
  )
}

export default IndexPage
