import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { Panel, Button } from 'writing-trainer-react-ui'

import {
  languageManager,
  languageUIManager,
  panelServices,
  usedText,
} from '../utils'

import * as styles from './main-page.module.scss'

const PANEL_UI = {
  noHideButton: true,
}

const IndexPage = () => {
  const [theme, setTheme] = useState('')

  useEffect(() => {
    const localTheme = localStorage.getItem('theme')

    if (localTheme) {
      setTheme(localTheme)
    }
  }, [])

  useEffect(() => {
    if (theme) {
      document.body.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  return (
    <div>
      <Head>
        <title>Writing Trainer</title>
      </Head>
      <h1 className={styles.title}>
        <span>Writing Trainer</span>{' '}
        <Button
          onClick={() => {
            setTheme(theme === 'light' ? 'dark' : 'light')
          }}
        >
          <span className={styles.desktop}>Change Theme</span>
          <span className={styles.mobile}>Theme</span>
        </Button>
      </h1>
      <div style={{ position: 'relative' }}>
        <Panel
          UI={PANEL_UI}
          languageManager={languageManager}
          languageUIManager={languageUIManager}
          services={panelServices}
          text={usedText}
        />
      </div>
    </div>
  )
}

export default IndexPage
