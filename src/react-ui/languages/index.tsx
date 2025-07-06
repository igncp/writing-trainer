import cantonese from './cantonese/cantonese';
import english from './english/english';
import japanese from './japanese/japanese';
import mandarin from './mandarin/mandarin';
import { T_LangUIController } from './types';

export const getController = (lang: string): T_LangUIController => {
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
