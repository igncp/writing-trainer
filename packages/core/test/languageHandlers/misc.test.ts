import {
  字元對象類別,
  englishHandler,
  japaneseHandler,
  mandarinHandler,
} from '../../src'

const HANDLERS = [japaneseHandler, englishHandler, mandarinHandler]

const DUMMY_CHAR_OBJS = [
  new 字元對象類別({
    pronunciation: 'foo',
    word: 'a',
  }),
  new 字元對象類別({
    pronunciation: 'bar',
    word: 'b',
  }),
]

describe('getCurrentCharObj', () => {
  HANDLERS.forEach(handler => {
    it(`gets the expected result for empty arrays - ${handler.getId()}`, () => {
      const result = handler.getCurrentCharObj({
        originalCharsObjs: [],
        practiceCharsObjs: [],
      })

      expect(result).toEqual(null)
    })

    it(`gets the expected result for exact sentence - ${handler.getId()}`, () => {
      const result = handler.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: DUMMY_CHAR_OBJS,
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[0], index: 0 })
    })

    it(`gets the expected result for smaller pronunciation - ${handler.getId()}`, () => {
      const result = handler.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: DUMMY_CHAR_OBJS.slice(0, 1),
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[1], index: 1 })
    })

    it(`gets the expected result for bigger pronunciation - ${handler.getId()}`, () => {
      const result = handler.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: DUMMY_CHAR_OBJS.concat(DUMMY_CHAR_OBJS.slice(0, 1)),
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[1], index: 1 })
    })

    it(`gets the expected result for invalid pronunciation - ${handler.getId()}`, () => {
      const result = handler.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: [
          new 字元對象類別({
            pronunciation: 'invalidPronunciation',
            word: 'invalid',
          }),
        ],
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[0], index: 0 })
    })
  })
})
