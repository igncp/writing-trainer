import { useTranslation } from 'react-i18next'

import Button, { T_ButtonProps } from '../../../components/button/button'

type Props = {
  language: string
  text: string
} & Omit<T_ButtonProps, 'children'>

const GoogleTranslateButton = ({ language, text, ...rest }: Props) => {
  const { i18n, t } = useTranslation()

  const hrefText = text
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  const hrefLang =
    {
      'zh-HK': 'yue',
    }[language] ?? 'auto'

  const intoLang =
    {
      en: 'en',
      es: 'es',
      jp: 'ja',
      zh_hant: 'yue',
    }[i18n.language] ?? 'en'

  return (
    <Button
      href={`https://translate.google.com/?sl=${hrefLang}&tl=${intoLang}&text=${encodeURIComponent(hrefText)}`}
      shouldUseLink
      {...rest}
    >
      {t('option.translateGoogle')}
    </Button>
  )
}

export default GoogleTranslateButton
