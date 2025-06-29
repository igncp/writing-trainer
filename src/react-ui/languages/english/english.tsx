import { englishHandler } from '#/core';

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

const loadDictionary = () => Promise.resolve();

const languageUIController: T_LangUIController = {
  getLangOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleKeyDown,
  languageHandler: englishHandler,
  loadDictionary,
  saveLangOptss,
  shouldAllCharsHaveSameWidth: false,
};

let _test:
  | {
      langOpts: typeof langOpts;
    }
  | undefined;

// istanbul ignore else
if (process.env.NODE_ENV === 'test') {
  _test = {
    langOpts,
  };
}

export { _test };

export default languageUIController;
