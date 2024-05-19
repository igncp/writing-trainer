import OptionsBlock from '../OptionsBlock'

const commonProps = {
  更改語言選項: () => {},
  語言選項: {},
}

describe('OptionsBlock', () => {
  it('returns null', () => {
    expect(OptionsBlock(commonProps)).toEqual(null)
  })
})
