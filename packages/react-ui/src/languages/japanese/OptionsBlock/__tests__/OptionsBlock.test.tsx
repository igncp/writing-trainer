import OptionsBlock from '../OptionsBlock'

const commonProps = {
  languageOptions: {},
  onOptionsChange: () => {},
}

describe('OptionsBlock', () => {
  it('returns null', () => {
    expect(OptionsBlock(commonProps)).toEqual(null)
  })
})
