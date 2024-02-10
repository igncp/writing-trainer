import React from 'react'

import { fireEvent, render } from '@testing-library/react'

import { DIM_COMP_OPACITY, HOVERED_COMP_OPACITY } from '../../../utils/ui'
import 按鈕 from '../按鈕'

const commonProps = {
  children: 'Test Content',
  onClick: jest.fn(),
}

describe('按鈕', () => {
  it('renders the content', () => {
    const { getByText } = render(<按鈕 {...commonProps} />)

    expect(() => getByText('Test Content')).not.toThrow()
  })

  it('renders a div by default', () => {
    const { baseElement } = render(<按鈕 {...commonProps} />)

    expect(baseElement.querySelectorAll('div').length).toEqual(2)
    expect(baseElement.querySelectorAll('a').length).toEqual(0)
  })

  it('renders a link when requested', () => {
    const { baseElement } = render(
      <按鈕 {...commonProps} href="hrefValue" shouldUseLink />,
    )

    expect(baseElement.querySelectorAll('div').length).toEqual(1)
    expect(baseElement.querySelectorAll('a').length).toEqual(1)

    expect(baseElement.querySelector('a')?.getAttribute('href')).toEqual(
      'hrefValue',
    )
  })

  it('changes opacity when hovered', () => {
    const { baseElement } = render(
      <按鈕 {...commonProps} href="hrefValue" shouldUseLink />,
    )

    const linkEl = baseElement.querySelector('a') as HTMLAnchorElement

    expect(linkEl.style.opacity).toEqual(DIM_COMP_OPACITY.toString())

    fireEvent.mouseEnter(linkEl)

    expect(linkEl.style.opacity).toEqual(HOVERED_COMP_OPACITY.toString())
  })

  it('click has no effect when disabled', () => {
    const { baseElement } = render(<按鈕 {...commonProps} disabled />)

    const el = baseElement.querySelector('div') as HTMLDivElement

    expect(commonProps.onClick.mock.calls.length).toEqual(0)

    fireEvent.click(el.childNodes[0] as any)

    expect(commonProps.onClick.mock.calls.length).toEqual(0)
  })

  it('click has effect when not disabled', () => {
    const { baseElement } = render(<按鈕 {...commonProps} />)

    const el = baseElement.querySelector('div') as HTMLDivElement

    expect(commonProps.onClick.mock.calls.length).toEqual(0)

    fireEvent.click(el.childNodes[0] as any)

    expect(commonProps.onClick.mock.calls.length).toEqual(1)
  })
})
