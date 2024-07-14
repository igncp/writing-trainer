import { useTranslation } from 'react-i18next'

import Button, { T_ButtonProps } from '../../../components/button/button'

type Props = {
  language: string
  text: string
} & Omit<T_ButtonProps, 'children'>

const GoogleTranslateButton = ({ language, text, ...rest }: Props) => {
  const { t } = useTranslation()

  const hrefText = text
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  return (
    <Button
      href={`https://translate.google.com/#${language}/en/${hrefText}`}
      shouldUseLink
      {...rest}
    >
      {t('option.translateGoogle')}
    </Button>
  )
}

export default GoogleTranslateButton
