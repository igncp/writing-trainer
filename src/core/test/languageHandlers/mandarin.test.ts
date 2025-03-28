import { specialChars, mandarinHandler } from '../..'

describe('values', () => {
  it('has the correct values', () => {
    expect(mandarinHandler.getId()).toEqual('mandarin')
    expect(mandarinHandler.getName()).toEqual('Mandarin')
  })
})

describe('getSpecialChars', () => {
  it('returns the expected array', () => {
    expect(mandarinHandler.getSpecialChars()).toEqual(
      specialChars.concat(
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(
          '',
        ),
      ),
    )

    expect(mandarinHandler.getSpecialChars()).toEqual(
      specialChars.concat(
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(
          '',
        ),
      ),
    )
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
      好: 'hao',
      你: 'ni',
      我: 'wo',
      很: 'hen',
      嗎: 'ma',
    }

    expect(
      mandarinHandler.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          dictionary: {
            ...fullDictionary,
            很: undefined,
          },
        },
        text: '你好嗎?我很好',
      }),
    ).toEqual(
      correctResult.map(c =>
        c.word === '很' ? { ...c, pronunciation: '?' } : c,
      ),
    )

    expect(
      mandarinHandler.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {},
        text: '你好嗎?我很好',
      }),
    ).toEqual(
      correctResult.map(c =>
        c.pronunciation ? { ...c, pronunciation: '?' } : c,
      ),
    )

    expect(
      mandarinHandler.convertToCharsObjs({
        charsToRemove: [],
        text: '你好嗎?我很好',
      }),
    ).toEqual(
      correctResult.map(c =>
        c.pronunciation ? { ...c, pronunciation: '?' } : c,
      ),
    )

    expect(
      mandarinHandler.convertToCharsObjs({
        charsToRemove: [],
        langOpts: {
          dictionary: fullDictionary,
          pronunciationInput: 'foo bar',
        },
        text: '你好嗎?我很好',
      }),
    ).toEqual(
      correctResult.map((c, cIdx) => ({
        ...c,
        pronunciation: ['foo', 'bar'][cIdx] || c.pronunciation,
      })),
    )
  })
})

describe('filterTextToPractice', () => {
  it('returns the expected string', () => {
    expect(
      mandarinHandler.filterTextToPractice({
        charsToRemove: [],
        text: ' 你好嗎?我很好!',
      }),
    ).toEqual('你好嗎我很好')
  })
})
