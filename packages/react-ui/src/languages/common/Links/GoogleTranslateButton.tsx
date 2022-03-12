import React from 'react'

import Button from '../../../components/Button/Button'

type T_GoogleTranslateButton = React.FC<{
  language: string
  text: string
}>

const GoogleTranslateButton: T_GoogleTranslateButton = ({ text, language }) => {
  const hrefText = text
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  return (
    <Button
      href={`https://translate.google.com/#${language}/en/${hrefText}`}
      shouldUseLink
    >
      Google Translate
    </Button>
  )
}

export default GoogleTranslateButton
