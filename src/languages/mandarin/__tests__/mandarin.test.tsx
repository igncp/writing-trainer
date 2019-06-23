import {
  _test,
  convertToCharsObjs,
  getFilteredTextToPracticeFn,
  handleDisplayedCharClick,
} from '../mandarinUtils'

const { privateFns } = _test

const origPrivateFns = { ...privateFns }

type T_addIndexOnMap = <O extends object>(
  o: O,
  index: number
) => O & { index: number }
const addIndexOnMap: T_addIndexOnMap = (o, index) => ({ ...o, index })

beforeEach(() => {
  Object.keys(origPrivateFns).forEach(fnName => {
    // tslint:disable-next-line semicolon
    ;(privateFns as any)[fnName] = (origPrivateFns as any)[fnName]
  })
})

describe('mandarinUtils', () => {
  describe('handleDisplayedCharClick', () => {
    beforeEach(() => {
      privateFns.sendCantodictFormForText = jest.fn()
    })

    it('does not break when passing an invalid charObj', () => {
      const fn = () => {
        handleDisplayedCharClick({} as any)
      }
      const fn2 = () => {
        handleDisplayedCharClick({ charObj: {} } as any)
      }

      expect(fn).not.toThrow()
      expect(fn2).not.toThrow()
    })

    it('sends once form when single item', () => {
      const charObj = {
        index: 0,
        pronunciation: 'foo',
        word: 'Foo',
      }
      handleDisplayedCharClick({ charObj, charsObjs: [charObj], index: 0 })

      expect((privateFns as any).sendCantodictFormForText.mock.calls).toEqual([
        ['Foo', 'single'],
      ])
    })

    it('sends twice form when last item', () => {
      const charObj = {
        index: 1,
        pronunciation: 'foo',
        word: 'Foo',
      }
      handleDisplayedCharClick({
        charObj,
        charsObjs: [{ word: 'bar', pronunciation: 'b', index: 0 }, charObj],
        index: 1,
      })

      expect((privateFns as any).sendCantodictFormForText.mock.calls).toEqual([
        ['Foo', 'single'],
        ['barFoo', 'left'],
      ])
    })

    it('sends twice form when first item', () => {
      const charObj = {
        index: 0,
        pronunciation: 'foo',
        word: 'Foo',
      }
      handleDisplayedCharClick({
        charObj,
        charsObjs: [charObj, { word: 'baz', pronunciation: 'BAM', index: 1 }],
        index: 0,
      })

      expect((privateFns as any).sendCantodictFormForText.mock.calls).toEqual([
        ['Foo', 'single'],
        ['Foobaz', 'right'],
      ])
    })

    it('sends form three times when middle item', () => {
      const charObj = {
        index: 1,
        pronunciation: 'foo',
        word: 'Foo',
      }
      handleDisplayedCharClick({
        charObj,
        charsObjs: [
          { word: 'Bam', pronunciation: '1', index: 0 },
          charObj,
          { word: 'baz', pronunciation: 'BAM', index: 2 },
        ],
        index: 1,
      })

      expect((privateFns as any).sendCantodictFormForText.mock.calls).toEqual([
        ['Foo', 'single'],
        ['BamFoo', 'left'],
        ['Foobaz', 'right'],
      ])
    })
  })

  describe('convertToCharsObjs', () => {
    it('returns the expected array when valid', () => {
      const result = convertToCharsObjs({
        charsToRemove: '',
        pronunciation: 'foo bar baz',
        text: 'ABC',
      })

      expect(result).toEqual(
        [
          {
            pronunciation: 'foo',
            word: 'A',
          },
          {
            pronunciation: 'bar',
            word: 'B',
          },
          {
            pronunciation: 'baz',
            word: 'C',
          },
        ].map(addIndexOnMap)
      )
    })

    it('returns the expected array when removing a char', () => {
      const result = convertToCharsObjs({
        charsToRemove: 'B',
        pronunciation: 'foo bar',
        text: 'ABC',
      })

      expect(result).toEqual(
        [
          {
            pronunciation: 'foo',
            word: 'A',
          },
          {
            pronunciation: '',
            word: 'B',
          },
          {
            pronunciation: 'bar',
            word: 'C',
          },
        ].map(addIndexOnMap)
      )
    })
  })

  describe('getFilteredTextToPracticeFn', () => {
    it('returns the expected values', () => {
      expect(getFilteredTextToPracticeFn('')('foo')).toEqual('')
      expect(getFilteredTextToPracticeFn('')('筆')).toEqual('筆')
      expect(getFilteredTextToPracticeFn('筆')('筆')).toEqual('')
    })
  })
})
