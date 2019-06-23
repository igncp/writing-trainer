import LinksBlock from '../LinksBlock'

const commonProps = {
  text: 'text value',
}

describe('LinksBlock', () => {
  it('returns null (tmp)', () => {
    expect(LinksBlock(commonProps)).toEqual(null)
  })
})
