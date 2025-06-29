import { Panel } from '#/react-ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { FaLanguage } from 'react-icons/fa6';

import {
  languageManager,
  languageUIManager,
  panelServices,
  usedText,
} from '../utils';
import HelpModal from './help-modal';

const PANEL_UI = {
  noHideButton: true,
};

const getPath = () => {
  if (typeof window === 'undefined') return '';

  return window.location.hash.replace(/^#/, '');
};

const IndexPage = () => {
  const [theme, setTheme] = useState('dark');
  const [showingLangs, setShowingLangs] = useState(false);
  const [showingHelp, setShowingHelp] = useState(false);
  const { i18n, t } = useTranslation();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentPath, setCurrentPath] = useState(getPath());

  const { query } = useRouter();

  const replacePath = useCallback((path: string) => {
    window.location.replace(`/#${path}`);
    setCurrentPath(path);
  }, []);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (theme) {
      document.body.setAttribute('data-theme', theme);
      document.cookie = `theme=${theme};path=/`;
    }
  }, [theme]);

  const changeLanguage = (lang: string) => {
    void i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div>
      <Head>
        <title>Writing Trainer</title>
      </Head>
      <h1 className="relative mx-[0] my-[16px] flex flex-row items-center justify-center gap-[1rem] text-[10px] md:text-[20px]">
        {hasLoaded && t('site.title')}
        <div className="absolute right-[24px] flex flex-row gap-[24px] text-[24px]">
          <button
            onClick={() => {
              setShowingHelp(!showingHelp);
            }}
          >
            <FaRegQuestionCircle />
          </button>
          <button
            onClick={() => {
              setShowingLangs(!showingLangs);
            }}
          >
            <FaLanguage />
          </button>
        </div>
      </h1>
      <h2
        className={[
          'mb-[12px] flex flex-row items-center justify-center gap-[24px]',
          showingLangs ? 'block' : 'hidden',
        ].join(' ')}
      >
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('en');
          }}
        >
          EN
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('zh_hant');
          }}
        >
          繁
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('jp');
          }}
        >
          日
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            changeLanguage('es');
          }}
        >
          ES
        </button>
      </h2>
      <div className="relative px-[8px] md:px-[16px]">
        <Panel
          getPath={() => currentPath}
          initialFragmentIndex={
            query.fragmentIndex ? Number(query.fragmentIndex) : undefined
          }
          languageManager={languageManager}
          languageUIManager={languageUIManager}
          onChangeTheme={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
          replacePath={replacePath}
          services={panelServices}
          text={usedText}
          UI={PANEL_UI}
        />
        {showingHelp && (
          <HelpModal
            isOpen={showingHelp}
            setIsOpen={(val) => setShowingHelp(val)}
          />
        )}
      </div>
    </div>
  );
};

export default IndexPage;
