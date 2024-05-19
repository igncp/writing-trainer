import { 特殊字元, cantoneseHandler } from '../..'

describe('values', () => {
  it('has the correct values', () => {
    expect(cantoneseHandler.getId()).toEqual('cantonese')
    expect(cantoneseHandler.getName()).toEqual('Cantonese')
  })
})

describe('取得特殊字符', () => {
  it('returns the expected array', () => {
    expect(cantoneseHandler.取得特殊字符()).toEqual(
      特殊字元.concat(
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(
          '',
        ),
      ),
    )

    expect(cantoneseHandler.取得特殊字符()).toEqual(
      特殊字元.concat(
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(
          '',
        ),
      ),
    )
  })
})

describe('轉換為字元對象列表', () => {
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
      cantoneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        text: '你好嗎?我很好',
        語言選項: {
          dictionary: {
            ...fullDictionary,
            很: undefined,
          },
        },
      }),
    ).toEqual(
      correctResult.map(c =>
        c.word === '很' ? { ...c, pronunciation: '?' } : c,
      ),
    )

    expect(
      cantoneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        text: '你好嗎?我很好',
        語言選項: {},
      }),
    ).toEqual(
      correctResult.map(c =>
        c.pronunciation ? { ...c, pronunciation: '?' } : c,
      ),
    )

    expect(
      cantoneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        text: '你好嗎?我很好',
      }),
    ).toEqual(
      correctResult.map(c =>
        c.pronunciation ? { ...c, pronunciation: '?' } : c,
      ),
    )

    expect(
      cantoneseHandler.轉換為字元對象列表({
        charsToRemove: [],
        text: '你好嗎?我很好',
        語言選項: {
          dictionary: fullDictionary,
          pronunciationInput: 'foo bar',
        },
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
      cantoneseHandler.filterTextToPractice({
        charsToRemove: [],
        text: ' 你好嗎?我很好!',
      }),
    ).toEqual('你好嗎我很好')
  })
})
