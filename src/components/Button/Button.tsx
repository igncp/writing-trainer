import React from 'react'

import { useHover } from '#/utils/hooks'
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '#/utils/ui'

type TButton = React.FC<{
  children: React.ReactNode
  href?: string
  onClick?(): void
  shouldUseLink?: boolean
  style?: React.CSSProperties
}>

const Button: TButton = ({ onClick, children, shouldUseLink, href, style }) => {
  const { hovered, bind } = useHover()
  const finalStyle = {
    color: 'black',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: 20,
    opacity: hovered ? HOVERED_COMP_OPACITY : DIM_COMP_OPACITY,
    padding: 10,
    textDecoration: 'none',
    transition: COMP_TRANSITION,
    ...style,
  }

  if (shouldUseLink) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        style={finalStyle}
        target="_blank"
        {...bind}
      >
        {children}
      </a>
    )
  }

  return (
    <div {...bind} onClick={onClick} style={finalStyle}>
      {children}
    </div>
  )
}

export default Button
