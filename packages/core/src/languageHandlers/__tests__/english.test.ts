import english from '../english'
import { SPECIAL_SYMBOLS } from '../_commonChars'

describe('values', () => {
  it('has the correct values', () => {
    expect(english.id).toEqual('english')
    expect(english.name).toEqual('English')
  })
})

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(english.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
    expect(english.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
  })
})

describe('convertToCharsObjs', () => {
  it('returns the correct array', () => {
    expect(
      english.convertToCharsObjs({
        charsToRemove: [],
        text: 'fo__o',
      })
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
      english.convertToCharsObjs({
        charsToRemove: [],
        text: 'ab c',
      })
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
      english.filterTextToPractice({ charsToRemove: [], text: 'foo' })
    ).toEqual('foo')

    expect(
      english.filterTextToPractice({ charsToRemove: [], text: 'f_o_o' })
    ).toEqual('foo')
  })
})
