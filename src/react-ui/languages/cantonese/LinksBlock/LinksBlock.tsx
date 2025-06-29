import ChangeCharType from '../../common/change-char-type/change-char-type';
import {
  DictButton,
  DictContent,
  useDictState,
} from '../../common/Links/DictButton';
import GTButton from '../../common/Links/GoogleTranslateButton';
import ToggleTonesButton from '../../common/Links/ToggleTonesButton';
import TranslateButton from '../../common/Links/TranslateButton';
import { T_LangOpts, T_LinksBlock } from '../../types';

const LinksBlock: T_LinksBlock = ({
  文字,
  focusWritingArea,
  fragments,
  langHandler,
  langOptsObj,
  updateFragments,
  updateLangOpts,
}) => {
  const dictState = useDictState();

  return (
    <>
      <div className="inline-flex flex-row flex-wrap gap-[12px]">
        <GTButton language="zh-HK" text={文字} />
        <DictButton language="zh-HK" text={文字} {...dictState} />
        <ToggleTonesButton
          focusWritingArea={focusWritingArea}
          langOpts={langOptsObj.langOpts as T_LangOpts}
          updateLangOpts={updateLangOpts}
        />
        <ChangeCharType
          fragments={fragments}
          updateFragments={updateFragments}
        />
        <TranslateButton language="zh-HK" text={文字} />
      </div>
      <DictContent
        {...dictState}
        langHandler={langHandler}
        langOptsObj={langOptsObj}
        text={文字}
      />
    </>
  );
};

export default LinksBlock;
