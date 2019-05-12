import React from 'react'

import { useHover } from '../../utils/hooks'

type TButton = React.FC<{
  style?: React.CSSProperties
  shouldUseLink?: boolean
  href?: string
  onClick?(): void
  children: React.ReactNode
}>

const Button: TButton = ({ onClick, children, shouldUseLink, href, style }) => {
  const { hovered, bind } = useHover()
  const finalStyle = {
    color: 'black',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: 20,
    opacity: hovered ? 0.7 : 0.2,
    padding: 10,
    textDecoration: 'none',
    transition: '1s all linear',
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
