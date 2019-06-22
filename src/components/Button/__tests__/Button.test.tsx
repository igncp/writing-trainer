import React from 'react'
import { fireEvent, render } from 'react-testing-library'

import Button from '../Button'

const commonProps = {
  children: 'Test Content',
  onClick: () => {},
}

describe('Button', () => {
  it('renders the content', () => {
    const { getByText } = render(<Button {...commonProps} />)

    expect(() => getByText('Test Content')).not.toThrow()
  })

  it('renders a div by default', () => {
    const { baseElement } = render(<Button {...commonProps} />)

    expect(baseElement.querySelectorAll('div').length).toEqual(2)
    expect(baseElement.querySelectorAll('a').length).toEqual(0)
  })

  it('renders a link when requested', () => {
    const { baseElement } = render(
      <Button {...commonProps} shouldUseLink href="hrefValue" />
    )

    expect(baseElement.querySelectorAll('div').length).toEqual(1)
    expect(baseElement.querySelectorAll('a').length).toEqual(1)
    expect(baseElement.querySelector('a').getAttribute('href')).toEqual(
      'hrefValue'
    )
  })

  it('changes opacity when hovered', () => {
    const { baseElement } = render(
      <Button {...commonProps} shouldUseLink href="hrefValue" />
    )

    const linkEl = baseElement.querySelector('a')

    expect(linkEl.style.opacity).toEqual('0.2')

    fireEvent.mouseEnter(linkEl)

    expect(linkEl.style.opacity).toEqual('0.7')
  })
})
