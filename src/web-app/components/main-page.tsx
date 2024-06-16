import { Panel } from '#/react-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { i18n, t } = useTranslation()

  const { query } = useRouter()

  useEffect(() => {
    if (theme) {
      document.body.setAttribute('data-theme', theme)
      document.cookie = `theme=${theme};path=/`
    }
  }, [theme])

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  return (
    <div>
      <Head>
        <title>Writing Trainer</title>
      </Head>
      <h1 className="mx-[0] my-[16px] flex flex-row items-center justify-center gap-[1rem] text-[10px] md:text-[20px]">
        {t('site.title', 'Writing Trainer')}
      </h1>
      <h2 className="mb-[12px] flex flex-row items-center justify-center gap-[24px]">
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('en')
          }}
        >
          EN
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('zh_hant')
          }}
        >
          繁
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('jp')
          }}
        >
          日
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('es')
          }}
        >
          ES
        </button>
      </h2>
      <div className="relative px-[8px] md:px-[16px]">
        <Panel
          UI={PANEL_UI}
          initialFragmentIndex={
            query.fragmentIndex ? Number(query.fragmentIndex) : undefined
          }
          languageManager={languageManager}
          languageUIManager={languageUIManager}
          onChangeTheme={() => {
            setTheme(theme === 'light' ? 'dark' : 'light')
          }}
          services={panelServices}
          text={usedText}
        />
      </div>
    </div>
  )
}

export default IndexPage
