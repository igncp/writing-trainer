import { EXTRA_SPECIAL_CHARS, LanguageDefinition } from '../constants';
import { convertToCharsObjsCommon, LanguageHandler } from './_common';

const convertToCharsObjs: LanguageHandler['convertToCharsObjs'] = (opts) =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  convertToCharsObjsCommon(cantoneseHandler)(opts);

const language = new LanguageDefinition({
  id: 'cantonese',
  name: 'Cantonese',
});

const cantoneseHandler = new LanguageHandler({
  convertToCharsObjs,
  extraSpecialChars: EXTRA_SPECIAL_CHARS,
  language,
});

export { cantoneseHandler };
