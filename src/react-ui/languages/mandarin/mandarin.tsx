import { mandarinHandler } from '#/core';

import OptionsBlock, {
  defaultUseTonesColors,
} from '../common/CharsOptions/OptionsBlock';
import { chineseBlurHandler } from '../common/chineseBlurHandler';
import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils';
import { 繁體轉簡體 } from '../common/conversion';
import { T_GetToneColor, T_LangOpts, T_LangUIController } from '../types';
import LinksBlock from './LinksBlock/LinksBlock';
import { T_MandarinLangOpts } from './mandarinTypes';

const charToPronunciationMap: { [key: string]: string } = {};
const pronunciationToCharMap: { [key: string]: string } = {};

const parsePronunciation = (文字: string, 選項?: T_LangOpts) => {
  let 解析後的文本 = 文字.toLowerCase();

  if ((選項?.聲調值 as T_MandarinLangOpts['聲調值']) === '不要使用聲調') {
    解析後的文本 = 解析後的文本.replace(/[0-9]/g, '');
  }

  return 解析後的文本;
};

const handleKeyDown: T_LangUIController['handleKeyDown'] = (參數) => {
  commonHandleWritingKeyDown(參數, {
    parsePronunciation,
  });
};

const langOptsBase: T_LangOpts = {
  dictionary: charToPronunciationMap,
};

const getLangOpts = () => {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  const rest = JSON.parse(localStorage.getItem('mandarinLangOpts') ?? '{}');

  return {
    ...langOptsBase,
    ...rest,
  } satisfies T_LangOpts;
};

const saveLangOptss = (opts: T_LangOpts) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const toSave = { ...opts };

  delete toSave.dictionary;

  localStorage.setItem('mandarinLangOpts', JSON.stringify(toSave));
};

const getToneColor: T_GetToneColor = (char, 選項, 字元) => {
  const useTonesColors = 選項.useTonesColors ?? defaultUseTonesColors;

  if (
    useTonesColors === 'never' ||
    !字元?.pronunciation ||
    (useTonesColors === 'current-error' && char !== 'current-error') ||
    (useTonesColors === 'current' &&
      !['current', 'current-error'].includes(char))
  ) {
    return undefined;
  }

  const 音數 = Number(字元.pronunciation[字元.pronunciation.length - 1]);

  if (Number.isNaN(音數)) {
    return undefined;
  }

  return {
    1: 'var(--color-error-silver)',
    2: 'var(--color-error-green)',
    3: 'var(--color-error-red)',
    4: 'var(--color-error-blue)',
    5: 'var(--color-error-yellow)',
  }[音數];
};

const loadDictionary = async () => {
  if (Object.keys(charToPronunciationMap).length) {
    return;
  }

  const dictionary = (await import('./converted-list-ma.yml')).default;

  const dictionaryParsed = (
    dictionary as { dict: Array<string | undefined> }
  ).dict.reduce<Record<string, [string, number] | undefined>>((acc, item) => {
    const [char, pronunciation, perc] = item?.split('\t') ?? [];

    if (!char || !pronunciation) {
      return acc;
    }

    const finalPerc = perc ? parseFloat(perc.replace('%', '')) : 0;
    const existing = acc[char];

    if (existing && existing[1] > finalPerc) {
      return acc;
    }

    acc[char] = [pronunciation, finalPerc];

    if (繁體轉簡體[char]) {
      繁體轉簡體[char]?.forEach((simplified) => {
        acc[simplified] = [pronunciation, finalPerc];
      });
    }

    return acc;
  }, {});

  Object.keys(dictionaryParsed).forEach((char) => {
    const item = dictionaryParsed[char];

    if (!item) return;

    [charToPronunciationMap[char]] = item;
    pronunciationToCharMap[item[0]] = char;
  });
};

const languageUIController: T_LangUIController = {
  處理清除事件: (處理程序: T_LangUIController) => {
    處理程序.saveLangOptss({
      ...處理程序.getLangOpts(),
      charsWithMistakes: [],
    });
  },
  getLangOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  getToneColor,
  handleKeyDown,
  languageHandler: mandarinHandler,
  loadDictionary,
  mobileKeyboard: [
    Array.from({ length: 5 }).map((_, i) => `${i + 1}`),
    ['q', 'w', 'e', 'r', 't', 'y', 'u'],
    ['i', 'o', 'p', 'a', 's', 'd', 'f'],
    ['g', 'h', 'j', 'k', 'l', 'z', 'x'],
    ['c', 'v', 'b', 'n', 'm'],
  ],
  onBlur: chineseBlurHandler,
  saveLangOptss,
  shouldAllCharsHaveSameWidth: false,
};

export default languageUIController;
