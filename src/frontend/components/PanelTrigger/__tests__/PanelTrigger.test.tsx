import React from 'react'
import { fireEvent, render } from 'react-testing-library'

import PanelTrigger from '../PanelTrigger'

const commonProps = {
  onClick: () => {},
}

describe('PanelTrigger', () => {
  it('renders the expected text', () => {
    const { getByText } = render(<PanelTrigger {...commonProps} />)

    expect(() => getByText('Open Writing Trainer')).not.toThrow()
  })

  it('changes opacity when hovered', () => {
    const { baseElement } = render(<PanelTrigger {...commonProps} />)

    const panelEl: any = baseElement.childNodes[0].childNodes[0]

    expect(panelEl.style.background).toEqual('rgba(255, 255, 255, 0.5)')

    fireEvent.mouseEnter(panelEl)

    expect(panelEl.style.background).toEqual('rgb(255, 255, 255)')
  })
})
