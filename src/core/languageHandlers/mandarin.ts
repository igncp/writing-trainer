import { EXTRA_SPECIAL_CHARS, LanguageDefinition } from '../constants';
import { convertToCharsObjsCommon, LanguageHandler } from './_common';

const convertToCharsObjs: LanguageHandler['convertToCharsObjs'] = (opts) =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  convertToCharsObjsCommon(mandarinHandler)(opts);

const language = new LanguageDefinition({
  id: 'mandarin',
  name: 'Mandarin',
});

const mandarinHandler = new LanguageHandler({
  convertToCharsObjs,
  extraSpecialChars: EXTRA_SPECIAL_CHARS,
  language,
});

export { mandarinHandler };
