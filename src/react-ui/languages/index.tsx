import cantonese from './cantonese/cantonese';
import english from './english/english';
import japanese from './japanese/japanese';
import mandarin from './mandarin/mandarin';
import { T_GetToneColor, T_HandleKeyDown, T_LangUIController } from './types';

const getLangUIController = (lang: string) => {
  switch (lang) {
    case 'cantonese':
      return cantonese;
    case 'english':
      return english;
    case 'japanese':
      return japanese;
    case 'mandarin':
      return mandarin;
    default:
      throw new Error(`Language ${lang} is not supported.`);
  }
};

export const getController = (lang: string) => {
  const getLangOpts = () => getLangUIController(lang).getLangOpts();

  const loadDictionary = () => getLangUIController(lang).loadDictionary();

  const handleKeyDown = (opts: Parameters<T_HandleKeyDown>[0]) =>
    getLangUIController(lang).handleKeyDown(opts);

  const saveLangOptss = (
    languageOpts: Parameters<T_LangUIController['saveLangOptss']>[0],
  ) => getLangUIController(lang).saveLangOptss(languageOpts);

  const getLinksBlock = () => getLangUIController(lang).getLinksBlock();

  const getOptionsBlock = () => getLangUIController(lang).getOptionsBlock();

  const getMobileKeyboard = () => getLangUIController(lang).mobileKeyboard;

  const getOnBlur = () => getLangUIController(lang).onBlur;

  const handleClearEvent = () => {
    const controller = getLangUIController(lang);

    return controller.handleClearEvent?.(controller);
  };

  const getToneColor = (...params: Parameters<T_GetToneColor>) =>
    getLangUIController(lang).getToneColor?.(...params);

  const shouldAllCharsHaveSameWidth = () =>
    getLangUIController(lang).shouldAllCharsHaveSameWidth;

  return {
    getLangOpts,
    getLinksBlock,
    getMobileKeyboard,
    getOnBlur,
    getOptionsBlock,
    getToneColor,
    handleClearEvent,
    handleKeyDown,
    loadDictionary,
    saveLangOptss,
    shouldAllCharsHaveSameWidth,
  };
};
