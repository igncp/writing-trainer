import { useTranslation } from 'react-i18next'

import Button from '../../../components/button/button'
import { 將文字複製到剪貼簿 } from '../../../utils/general'
import GTButton from '../../common/Links/GoogleTranslateButton'
import TranslateButton from '../../common/Links/TranslateButton'
import ChangeCharType from '../../common/change-char-type/change-char-type'
import { T_LinksBlock } from '../../types'

const MANDARIN_CONVERTER_LINK =
  'https://www.chineseconverter.com/en/convert/chinese-to-pinyin'

const LinksBlock: T_LinksBlock = ({ fragments, 文字, 更改fragments }) => {
  const hrefText = 文字
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')
  const { t } = useTranslation()

  return (
    <>
      <GTButton language="zh-CN" text={文字} />
      <Button
        onClick={() => {
          將文字複製到剪貼簿(hrefText)
          window.open(MANDARIN_CONVERTER_LINK)
        }}
      >
        {t('option.pronunciation')}
      </Button>
      <ChangeCharType fragments={fragments} 更改fragments={更改fragments} />
      <TranslateButton language="zh-HK" text={文字} />
    </>
  )
}

export default LinksBlock
