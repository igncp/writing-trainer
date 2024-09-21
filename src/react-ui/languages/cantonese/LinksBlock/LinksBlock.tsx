import { useTranslation } from 'react-i18next'

import Button from '../../../components/button/button'
import { 將文字複製到剪貼簿 } from '../../../utils/general'
import CantoDictButton from '../../common/Links/CantoDictButton'
import GTButton from '../../common/Links/GoogleTranslateButton'
import TranslateButton from '../../common/Links/TranslateButton'
import ChangeCharType from '../../common/change-char-type/change-char-type'
import { T_LinksBlock } from '../../types'

const CANTONESE_CONVERTER_LINK =
  'https://www.cantonesetools.org/en/cantonese-to-jyutping'

const LinksBlock: T_LinksBlock = ({ fragments, updateFragments, 文字 }) => {
  const { t } = useTranslation()

  const hrefText = 文字
    .split('')
    .map(c => c.trim())
    .filter(c => !!c)
    .join('')

  return (
    <>
      <GTButton language="zh-HK" text={文字} />
      <Button
        onClick={() => {
          將文字複製到剪貼簿(hrefText)
          window.open(CANTONESE_CONVERTER_LINK)
        }}
      >
        {t('option.pronunciation')}
      </Button>
      <ChangeCharType fragments={fragments} updateFragments={updateFragments} />
      <TranslateButton language="zh-HK" text={文字} />
      <CantoDictButton language="zh-HK" text={文字} />
    </>
  )
}

export default LinksBlock
