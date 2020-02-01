import japanese from '../japanese'
import { SPECIAL_SYMBOLS } from '../_commonChars'

describe('values', () => {
  it('has the correct values', () => {
    expect(japanese.id).toEqual('japanese')
    expect(japanese.name).toEqual('Japanese')
  })
})

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(japanese.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
    expect(japanese.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
  })
})

describe('convertToCharsObjs', () => {
  it('returns the correct array when correct pronunciation', () => {
    expect(
      japanese.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'ai2 ue2 o1',
        },
        text: 'あい,うえお',
      })
    ).toEqual([
      {
        pronunciation: 'ai',
        word: 'あい',
      },
      {
        pronunciation: '',
        word: ',',
      },
      {
        pronunciation: 'ue',
        word: 'うえ',
      },
      {
        pronunciation: 'o',
        word: 'お',
      },
    ])
  })

  it('returns the expected array when invalid pronunciation', () => {
    expect(
      japanese.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'ai2 ue o1',
        },
        text: 'あい,うえお',
      })
    ).toEqual([
      {
        pronunciation: 'ai',
        word: 'あい',
      },
      {
        pronunciation: '',
        word: ',',
      },
      {
        pronunciation: 'ue',
        word: 'う',
      },
      {
        pronunciation: 'o',
        word: 'え',
      },
      {
        pronunciation: '?',
        word: 'お',
      },
    ])

    expect(
      japanese.convertToCharsObjs({
        charsToRemove: [],
        text: 'あい,うえお',
      })
    ).toEqual([
      {
        pronunciation: '?',
        word: 'あい',
      },
      {
        pronunciation: '',
        word: ',',
      },
      {
        pronunciation: '?',
        word: 'うえお',
      },
    ])

    expect(
      japanese.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'ai0 eu1',
        },
        text: 'あい えう',
      })
    ).toEqual([
      {
        pronunciation: 'ai',
        word: 'あい',
      },
      {
        pronunciation: '',
        word: ' ',
      },
      {
        pronunciation: 'eu',
        word: 'え',
      },
      {
        pronunciation: '?',
        word: 'う',
      },
    ])
  })
})

describe('filterTextToPractice', () => {
  it('returns the expected string', () => {
    expect(
      japanese.filterTextToPractice({ charsToRemove: [], text: 'foo' })
    ).toEqual('foo')

    expect(
      japanese.filterTextToPractice({ charsToRemove: [], text: 'f_o_o' })
    ).toEqual('foo')
  })
})
