import { render } from '@testing-library/react'

import OptionsBlock from '../OptionsBlock'

const commonProps = {
  更改語言選項: () => {},
  語言選項: {},
}

describe('OptionsBlock', () => {
  it('renders some dummy content', () => {
    const { getByText } = render(<OptionsBlock {...commonProps} />)

    expect(() => getByText('Options Block')).not.toThrow()
  })
})
