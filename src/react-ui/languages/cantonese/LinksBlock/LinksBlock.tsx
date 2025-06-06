import CantoDictButton from '../../common/Links/CantoDictButton'
import {
  DictButton,
  DictContent,
  useDictState,
} from '../../common/Links/DictButton'
import GTButton from '../../common/Links/GoogleTranslateButton'
import TranslateButton from '../../common/Links/TranslateButton'
import ChangeCharType from '../../common/change-char-type/change-char-type'
import { T_LinksBlock } from '../../types'

const LinksBlock: T_LinksBlock = ({
  文字,
  fragments,
  langHandler,
  langOptsObj,
  updateFragments,
}) => {
  const dictState = useDictState()

  return (
    <>
      <div className="inline-flex flex-row flex-wrap gap-[12px]">
        <GTButton language="zh-HK" text={文字} />
        <DictButton language="zh-HK" text={文字} {...dictState} />
        <ChangeCharType
          fragments={fragments}
          updateFragments={updateFragments}
        />
        <TranslateButton language="zh-HK" text={文字} />
        <CantoDictButton text={文字} />
      </div>
      <DictContent
        {...dictState}
        langHandler={langHandler}
        langOptsObj={langOptsObj}
        text={文字}
      />
    </>
  )
}

export default LinksBlock
