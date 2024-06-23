import { englishHandler, 特殊字元 } from '../..'

describe('values', () => {
  it('has the correct values', () => {
    expect(englishHandler.getId()).toEqual('english')
    expect(englishHandler.getName()).toEqual('English')
  })
})

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(englishHandler.getSpecialChars()).toEqual(特殊字元)
    expect(englishHandler.getSpecialChars()).toEqual(特殊字元)
  })
})

describe('轉換為字元對象列表', () => {
  it('returns the correct array', () => {
    expect(
      englishHandler.轉換為字元對象列表({
        charsToRemove: [],
        text: 'fo__o',
      }),
    ).toEqual([
      {
        pronunciation: 'fo',
        word: 'fo',
      },
      {
        pronunciation: '',
        word: '_',
      },
      {
        pronunciation: '',
        word: '_',
      },
      {
        pronunciation: 'o',
        word: 'o',
      },
    ])

    expect(
      englishHandler.轉換為字元對象列表({
        charsToRemove: [],
        text: 'ab c',
      }),
    ).toEqual([
      {
        pronunciation: 'ab',
        word: 'ab',
      },
      {
        pronunciation: '',
        word: ' ',
      },
      {
        pronunciation: 'c',
        word: 'c',
      },
    ])
  })
})

describe('filterTextToPractice', () => {
  it('returns the expected string', () => {
    expect(
      englishHandler.filterTextToPractice({ charsToRemove: [], text: 'foo' }),
    ).toEqual('foo')

    expect(
      englishHandler.filterTextToPractice({ charsToRemove: [], text: 'f_o_o' }),
    ).toEqual('foo')
  })
})
