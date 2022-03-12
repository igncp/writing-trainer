import { englishHandler, SPECIAL_SYMBOLS } from '../../src'

describe('values', () => {
  it('has the correct values', () => {
    expect(englishHandler.language.id).toEqual('english')
    expect(englishHandler.language.name).toEqual('English')
  })
})

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(englishHandler.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
    expect(englishHandler.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
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
