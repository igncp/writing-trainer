import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils';
import { T_LangOpts, T_LangUIController } from '../types';
import LinksBlock from './LinksBlock/LinksBlock';
import OptionsBlock from './OptionsBlock';

const handleKeyDown: T_LangUIController['handleKeyDown'] = (params) => {
  commonHandleWritingKeyDown(params, {});
};

const langOpts: T_LangOpts = {};

const getLangOpts = () => langOpts;

const saveLangOptss = () => {};

const loadDictionary = () => Promise.resolve(undefined);

const languageUIController: T_LangUIController = {
  getLangOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleKeyDown,
  loadDictionary,
  saveLangOptss,
  shouldAllCharsHaveSameWidth: false,
};

export default languageUIController;
