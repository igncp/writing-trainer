import 按鈕, { T_ButtonProps } from '../../../components/按鈕/按鈕'

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
    <按鈕
      href={`https://translate.google.com/#${language}/en/${hrefText}`}
      shouldUseLink
      {...rest}
    >
      Google Translate
    </按鈕>
  )
}

export default GoogleTranslateButton
