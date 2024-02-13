import { japaneseHandler, 特殊字元 } from '../../src'

describe('values', () => {
  it('has the correct values', () => {
    expect(japaneseHandler.getId()).toEqual('japanese')
    expect(japaneseHandler.getName()).toEqual('Japanese')
  })
})

describe('取得特殊字符', () => {
  it('returns the expected array', () => {
    expect(japaneseHandler.取得特殊字符()).toEqual(特殊字元)
    expect(japaneseHandler.取得特殊字符()).toEqual(特殊字元)
  })
})

describe('convertToCharsObjs', () => {
  it('returns the correct array when correct pronunciation', () => {
    expect(
      japaneseHandler.convertToCharsObjs({
        charsToRemove: [],
        text: 'あい,うえお',
        語言選項: {
          pronunciationInput: 'ai2 ue2 o1',
        },
      }),
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
      japaneseHandler.convertToCharsObjs({
        charsToRemove: [],
        text: 'あい,うえお',
        語言選項: {
          pronunciationInput: 'ai2 ue o1',
        },
      }),
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
      japaneseHandler.convertToCharsObjs({
        charsToRemove: [],
        text: 'あい,うえお',
      }),
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
      japaneseHandler.convertToCharsObjs({
        charsToRemove: [],
        text: 'あい えう',
        語言選項: {
          pronunciationInput: 'ai0 eu1',
        },
      }),
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

  it('replaces the expected characters', () => {
    expect(
      japaneseHandler.convertToCharsObjs({
        charsToRemove: [],
        text: 'あい',
        語言選項: {
          pronunciationInput: 'fō2',
        },
      }),
    ).toEqual([
      {
        pronunciation: 'fou',
        word: 'あい',
      },
    ])
  })

  it('turns all letters to lowercase', () => {
    expect(
      japaneseHandler.convertToCharsObjs({
        charsToRemove: [],
        text: 'あい',
        語言選項: {
          pronunciationInput: 'AbCdE2',
        },
      }),
    ).toEqual([
      {
        pronunciation: 'abcde',
        word: 'あい',
      },
    ])
  })
})

describe('filterTextToPractice', () => {
  it('returns the expected string', () => {
    expect(
      japaneseHandler.filterTextToPractice({ charsToRemove: [], text: 'foo' }),
    ).toEqual('foo')

    expect(
      japaneseHandler.filterTextToPractice({
        charsToRemove: [],
        text: 'f_o_o',
      }),
    ).toEqual('foo')
  })
})
