import { englishHandler, 特殊字元 } from '../../src'

describe('values', () => {
  it('has the correct values', () => {
    expect(englishHandler.getId()).toEqual('english')
    expect(englishHandler.getName()).toEqual('English')
  })
})

describe('取得特殊字符', () => {
  it('returns the expected array', () => {
    expect(englishHandler.取得特殊字符()).toEqual(特殊字元)
    expect(englishHandler.取得特殊字符()).toEqual(特殊字元)
  })
})

describe('convertToCharsObjs', () => {
  it('returns the correct array', () => {
    expect(
      englishHandler.convertToCharsObjs({
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
      englishHandler.convertToCharsObjs({
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
