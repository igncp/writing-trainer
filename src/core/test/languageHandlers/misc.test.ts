import {
  T_CharObj,
  englishHandler,
  japaneseHandler,
  mandarinHandler,
} from '../..'

const HANDLERS = [japaneseHandler, englishHandler, mandarinHandler]

const DUMMY_CHAR_OBJS = [
  new T_CharObj({
    pronunciation: 'foo',
    word: 'a',
  }),
  new T_CharObj({
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
          new T_CharObj({
            pronunciation: 'invalidPronunciation',
            word: 'invalid',
          }),
        ],
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[0], index: 0 })
    })
  })
})
