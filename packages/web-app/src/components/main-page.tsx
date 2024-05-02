import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Panel } from 'writing-trainer-react-ui'

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
      <h1 className="margin-[0] flex flex-row items-center justify-center gap-[1rem] text-[10px] md:text-[20px]">
        <span>Writing Trainer</span>{' '}
      </h1>
      <div style={{ position: 'relative' }}>
        <Panel
          UI={PANEL_UI}
          initialFragmentIndex={
            query.fragmentIndex ? Number(query.fragmentIndex) : undefined
          }
          languageManager={languageManager}
          關於改變主題={() => {
            setTheme(theme === 'light' ? 'dark' : 'light')
          }}
          languageUIManager={languageUIManager}
          services={panelServices}
          text={usedText}
        />
      </div>
    </div>
  )
}

export default IndexPage
