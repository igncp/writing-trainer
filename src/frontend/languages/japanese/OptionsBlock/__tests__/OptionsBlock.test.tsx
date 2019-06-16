import OptionsBlock from '../OptionsBlock'

const commonProps = {
  onOptionsChange: () => {},
}

describe('OptionsBlock', () => {
  it('returns null', () => {
    expect(OptionsBlock(commonProps)).toEqual(null)
  })
})
