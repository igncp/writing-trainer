import { createInstance } from 'i18next';
import HttpApi from 'i18next-http-backend';
import { PropsWithChildren } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

const defaultLang = 'en';

let instance = undefined;

if (typeof window !== 'undefined') {
  const currentLang = window.localStorage.getItem('lang') ?? defaultLang;

  const backendOptions = {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  };

  instance = createInstance();

  instance
    .use(initReactI18next)
    .use(HttpApi)
    .init({
      backend: backendOptions,
      fallbackLng: currentLang,
      load: 'currentOnly',
      ns: ['translation'],
    })
    .catch((err) => {
      console.error('debug: i18n.tsx: err', err);
    });
}

export const LangProvider = ({ children }: PropsWithChildren) => (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <I18nextProvider i18n={instance as any}>{children}</I18nextProvider>
);
