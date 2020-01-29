import mandarin from '../mandarin'
import { SPECIAL_SYMBOLS } from '../_commonChars'

describe('values', () => {
  it('has the correct values', () => {
    expect(mandarin.id).toEqual('mandarin')
    expect(mandarin.name).toEqual('Mandarin')
  })
})

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(mandarin.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
    expect(mandarin.getSpecialChars()).toEqual(SPECIAL_SYMBOLS)
  })
})

describe('convertToCharsObjs', () => {
  it('returns the correct arrays', () => {
    const correctResult = [
      {
        pronunciation: 'ni',
        word: '你',
      },
      {
        pronunciation: 'hao',
        word: '好',
      },
      {
        pronunciation: 'ma',
        word: '嗎',
      },
      {
        pronunciation: '',
        word: '?',
      },
      {
        pronunciation: 'wo',
        word: '我',
      },
      {
        pronunciation: 'hen',
        word: '很',
      },
      {
        pronunciation: 'hao',
        word: '好',
      },
    ]

    const fullDictionary = {
      你: 'ni',
      嗎: 'ma',
      好: 'hao',
      很: 'hen',
      我: 'wo',
    }

    expect(
      mandarin.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          dictionary: {
            ...fullDictionary,
            很: undefined,
          },
        },
        text: '你好嗎?我很好',
      })
    ).toEqual(
      correctResult.map(c =>
        c.word === '很' ? { ...c, pronunciation: '?' } : c
      )
    )

    expect(
      mandarin.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {},
        text: '你好嗎?我很好',
      })
    ).toEqual(
      correctResult.map(c =>
        c.pronunciation ? { ...c, pronunciation: '?' } : c
      )
    )

    expect(
      mandarin.convertToCharsObjs({
        charsToRemove: [],
        text: '你好嗎?我很好',
      })
    ).toEqual(
      correctResult.map(c =>
        c.pronunciation ? { ...c, pronunciation: '?' } : c
      )
    )

    expect(
      mandarin.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          dictionary: fullDictionary,
          pronunciationInput: 'foo bar',
        },
        text: '你好嗎?我很好',
      })
    ).toEqual(
      correctResult.map((c, cIdx) => ({
        ...c,
        pronunciation: ['foo', 'bar'][cIdx] || c.pronunciation,
      }))
    )
  })
})

describe('filterTextToPractice', () => {
  it('returns the expected string', () => {
    expect(
      mandarin.filterTextToPractice({
        charsToRemove: [],
        text: ' 你好嗎?我很好!',
      })
    ).toEqual('你好嗎我很好')
  })
})
