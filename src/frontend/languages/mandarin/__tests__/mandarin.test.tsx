import { handleDisplayedCharClick } from '../mandarinUtils'

describe('mandarinUtils', () => {
  describe('handleDisplayedCharClick', () => {
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
  })
})
