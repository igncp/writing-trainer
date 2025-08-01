import OptionsBlock, {
  defaultUseTonesColors,
} from '../common/CharsOptions/OptionsBlock';
import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils';
import { 繁體轉簡體 } from '../common/conversion';
import { T_GetToneColor, T_LangOpts, T_LangUIController } from '../types';
import LinksBlock from './LinksBlock/LinksBlock';

const charToPronunciationMap: { [key: string]: string } = {};
const pronunciationToCharMap: { [key: string]: string } = {};

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
    3: 'var(--color-error-pink)',
    4: 'var(--color-error-blue)',
    5: 'var(--color-error-orange)',
    6: 'var(--color-error-purple)',
  }[音數];
};

const loadDictionary = async (): Promise<Array<[string, string]>> => {
  const getParsedDictionary = () => Object.entries(charToPronunciationMap);

  if (Object.keys(charToPronunciationMap).length) {
    return getParsedDictionary();
  }

  const dictionary = (await import('./converted-list-jy.yml')).default as {
    dict: Array<string | undefined>;
  };

  const dictionaryParsed = (
    dictionary as { dict: Array<string | undefined> }
  ).dict.reduce<Record<string, [string, number] | undefined>>((acc, item) => {
    const [char, pronunciation, perc] = item?.split('\t') ?? [];

    if (!char || !pronunciation) {
      return acc;
    }

    const finalPerc = perc ? parseFloat(perc.replace('%', '')) : 101;
    const existing = acc[char];

    if (existing && existing[1] > finalPerc) {
      return acc;
    }

    if (繁體轉簡體[char]) {
      繁體轉簡體[char]?.forEach((simplified) => {
        acc[simplified] = [pronunciation, finalPerc];
      });
    }

    acc[char] = [pronunciation, finalPerc];

    return acc;
  }, {});

  Object.keys(dictionaryParsed).forEach((char) => {
    const item = dictionaryParsed[char];

    if (!item) return;

    [charToPronunciationMap[char]] = item;
    pronunciationToCharMap[item[0]] = char;
  });

  return getParsedDictionary();
};

const languageUIController: T_LangUIController = {
  getLangOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  getToneColor,
  handleClearEvent: (處理程序: T_LangUIController) => {
    處理程序.saveLangOptss({
      ...處理程序.getLangOpts(),
      charsWithMistakes: [],
    });
  },
  handleKeyDown: commonHandleWritingKeyDown,
  loadDictionary,
  saveLangOptss,
  shouldAllCharsHaveSameWidth: false,
};

export default languageUIController;
