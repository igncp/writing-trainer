import React from 'react'

import Button, { T_ButtonProps } from '../../../components/Button/Button'

type Props = {
  language: string
  text: string
} & Omit<T_ButtonProps, 'children'>

const GoogleTranslateButton = ({ language, text, ...rest }: Props) => {
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
      Google Translate
    </Button>
  )
}

export default GoogleTranslateButton
