import React from 'react'
import { fireEvent, render } from 'react-testing-library'

import { DIM_COMP_OPACITY, HOVERED_COMP_OPACITY } from '#/utils/ui'

import Button from '../Button'

const commonProps = {
  children: 'Test Content',
  onClick: jest.fn(),
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
      <Button {...commonProps} href="hrefValue" shouldUseLink />
    )

    expect(baseElement.querySelectorAll('div').length).toEqual(1)
    expect(baseElement.querySelectorAll('a').length).toEqual(1)

    expect(baseElement.querySelector('a').getAttribute('href')).toEqual(
      'hrefValue'
    )
  })

  it('changes opacity when hovered', () => {
    const { baseElement } = render(
      <Button {...commonProps} href="hrefValue" shouldUseLink />
    )

    const linkEl = baseElement.querySelector('a')

    expect(linkEl.style.opacity).toEqual(DIM_COMP_OPACITY.toString())

    fireEvent.mouseEnter(linkEl)

    expect(linkEl.style.opacity).toEqual(HOVERED_COMP_OPACITY.toString())
  })

  it('click has no effect when disabled', () => {
    const { baseElement } = render(<Button {...commonProps} disabled />)

    const el: HTMLDivElement = baseElement.querySelector('div')

    expect(commonProps.onClick.mock.calls.length).toEqual(0)

    fireEvent.click(el.childNodes[0] as any)

    expect(commonProps.onClick.mock.calls.length).toEqual(0)
  })

  it('click has effect when not disabled', () => {
    const { baseElement } = render(<Button {...commonProps} />)

    const el: HTMLDivElement = baseElement.querySelector('div')

    expect(commonProps.onClick.mock.calls.length).toEqual(0)

    fireEvent.click(el.childNodes[0] as any)

    expect(commonProps.onClick.mock.calls.length).toEqual(1)
  })
})
