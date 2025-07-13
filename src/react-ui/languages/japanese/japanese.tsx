import { commonHandleWritingKeyDown } from '../common/commonLanguageUtils';
import { T_LangOpts, T_LangUIController } from '../types';
import LinksBlock from './LinksBlock/LinksBlock';
import OptionsBlock from './OptionsBlock/OptionsBlock';

const charToPronunciationMap: { [key: string]: string } = {};
const pronunciationToCharMap: { [key: string]: string } = {};

const langOpts: T_LangOpts = {
  dictionary: charToPronunciationMap,
};

const loadDictionary = async () => {
  const getParsedDictionary = () => Object.entries(charToPronunciationMap);

  if (Object.keys(charToPronunciationMap).length) {
    return getParsedDictionary();
  }

  const dictionary = (await import('./list.csv')).default;

  const dictionaryParsed = dictionary.reduce<
    Record<string, [string] | undefined>
  >((acc, item) => {
    const [char, pronunciation] = item;

    if (!char || !pronunciation) {
      return acc;
    }

    acc[char] = [pronunciation];

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
  getLangOpts: () => langOpts,
  getLinksBlock: () => LinksBlock,
  getOptionsBlock: () => OptionsBlock,
  handleKeyDown: commonHandleWritingKeyDown,
  loadDictionary,
  saveLangOptss: () => {},
  shouldAllCharsHaveSameWidth: false,
};

export default languageUIController;
