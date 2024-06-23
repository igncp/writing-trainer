import { japaneseHandler, 特殊字元 } from '../..'

describe('values', () => {
  it('has the correct values', () => {
    expect(japaneseHandler.getId()).toEqual('japanese')
    expect(japaneseHandler.getName()).toEqual('Japanese')
  })
})

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(japaneseHandler.getSpecialChars()).toEqual(特殊字元)
    expect(japaneseHandler.getSpecialChars()).toEqual(特殊字元)
  })
})

describe('轉換為字元對象列表', () => {
  it('returns the correct array when correct pronunciation', () => {
    expect(
      japaneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'ai2 ue2 o1',
        },
        text: 'あい,うえお',
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
      japaneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'ai2 ue o1',
        },
        text: 'あい,うえお',
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
      japaneseHandler.轉換為字元對象列表({
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
      japaneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'ai0 eu1',
        },
        text: 'あい えう',
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
      japaneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'fō2',
        },
        text: 'あい',
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
      japaneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        langOpts: {
          pronunciationInput: 'AbCdE2',
        },
        text: 'あい',
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
