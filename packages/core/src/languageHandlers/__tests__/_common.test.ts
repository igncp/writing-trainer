import japanese from '../japanese'
import english from '../english'
import mandarin from '../mandarin'

const LANGUAGES = [japanese, english, mandarin]

const DUMMY_CHAR_OBJS = [
  {
    pronunciation: 'foo',
    word: 'a',
  },
  {
    pronunciation: 'bar',
    word: 'b',
  },
]

describe('getCurrentCharObj', () => {
  LANGUAGES.forEach((language) => {
    it(`gets the expected result for empty arrays - ${language.id}`, () => {
      const result = language.getCurrentCharObj({
        originalCharsObjs: [],
        practiceCharsObjs: [],
      })

      expect(result).toEqual(null)
    })

    it(`gets the expected result for exact sentence - ${language.id}`, () => {
      const result = language.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: DUMMY_CHAR_OBJS,
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[0], index: 0 })
    })

    it(`gets the expected result for smaller pronunciation - ${language.id}`, () => {
      const result = language.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: DUMMY_CHAR_OBJS.slice(0, 1),
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[1], index: 1 })
    })

    it(`gets the expected result for bigger pronunciation - ${language.id}`, () => {
      const result = language.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: DUMMY_CHAR_OBJS.concat(DUMMY_CHAR_OBJS.slice(0, 1)),
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[1], index: 1 })
    })

    it(`gets the expected result for invalid pronunciation - ${language.id}`, () => {
      const result = language.getCurrentCharObj({
        originalCharsObjs: DUMMY_CHAR_OBJS,
        practiceCharsObjs: [
          {
            pronunciation: 'invalidPronunciation',
            word: 'invalid',
          },
        ],
      })

      expect(result).toEqual({ ch: DUMMY_CHAR_OBJS[0], index: 0 })
    })
  })
})
