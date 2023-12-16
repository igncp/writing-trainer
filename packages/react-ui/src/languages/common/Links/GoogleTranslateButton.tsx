import React from 'react'

import Button from '../../../components/Button/Button'

type Props = {
  language: string
  text: string
}

const GoogleTranslateButton = ({ text, language }: Props) => {
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
