import { japaneseHandler, specialChars, T_CharObj } from '../..';

describe('values', () => {
  it('has the correct values', () => {
    expect(japaneseHandler.getId()).toEqual('japanese');
    expect(japaneseHandler.getName()).toEqual('Japanese');
  });
});

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(japaneseHandler.getSpecialChars()).toEqual(specialChars);
    expect(japaneseHandler.getSpecialChars()).toEqual(specialChars);
  });
});

describe('convertToCharsObjs', () => {
  it('returns the correct array when correct pronunciation', () => {
    expect(
      japaneseHandler.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          dictionary: {
            約束: 'yakusoku',
            は: 'ha',
          },
        },
        text: '約束 は ',
      }),
    ).toEqual([
      new T_CharObj({
        pronunciation: 'yakusoku',
        word: '約束',
      }),
      new T_CharObj({
        pronunciation: '',
        word: ' ',
      }),
      new T_CharObj({
        pronunciation: 'ha',
        word: 'は',
      }),
      new T_CharObj({
        pronunciation: '',
        word: ' ',
      }),
    ]);
  });
});

describe('filterTextToPractice', () => {
  it('returns the expected string', () => {
    expect(
      japaneseHandler.filterTextToPractice({ charsToRemove: [], text: 'foo' }),
    ).toEqual('foo');

    expect(
      japaneseHandler.filterTextToPractice({
        charsToRemove: [],
        text: 'f_o_o',
      }),
    ).toEqual('foo');
  });
});
