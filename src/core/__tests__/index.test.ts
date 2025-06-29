import * as writingTrainer from '..';
import { LanguageDefinition, unknownPronunciation } from '../constants';
import { specialChars } from '../languageHandlers/_特殊字元';
import { LanguageHandler } from '../languageHandlers/_common';
import { cantoneseHandler } from '../languageHandlers/cantonese';
import { englishHandler } from '../languageHandlers/english';
import { japaneseHandler } from '../languageHandlers/japanese';
import { mandarinHandler } from '../languageHandlers/mandarin';
import { CurrentCharObj, LanguageManager, T_CharObj } from '../languageManager';
import { Record } from '../records';

describe('interface', () => {
  it('contains the expected interface', () => {
    expect(writingTrainer).toEqual({
      cantoneseHandler,
      CurrentCharObj,
      englishHandler,
      japaneseHandler,
      LanguageDefinition,
      LanguageHandler,
      LanguageManager,
      mandarinHandler,
      Record,
      specialChars,
      T_CharObj,
      unknownPronunciation,
    });
  });
});
