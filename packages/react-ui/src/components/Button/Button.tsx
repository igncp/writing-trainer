import React from 'react'

import { useHover } from '../../utils/hooks'
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '../../utils/ui'

const noop = () => {}

type T_ButtonProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  href?: string
  onClick?: () => void
  shouldUseLink?: boolean
  style?: React.CSSProperties
}

const Button = ({
  children,
  className,
  disabled,
  href,
  onClick,
  shouldUseLink,
  style,
}: T_ButtonProps) => {
  const { hovered, bind } = useHover()
  const finalStyle = {
    color: 'var(--color-text, "black")',
    cursor: disabled ?? !onClick ? 'default' : 'pointer',
    display: 'inline-block',
    fontSize: 20,
    opacity: hovered && !disabled ? HOVERED_COMP_OPACITY : DIM_COMP_OPACITY,
    padding: 10,
    textDecoration: 'none',
    textShadow: disabled ? '1px 1px 5px blue' : '',
    transition: COMP_TRANSITION,
    ...style,
  }

  if (shouldUseLink) {
    return (
      <a
        className={className}
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
    <div {...bind} onClick={disabled ? noop : onClick} style={finalStyle}>
      {children}
    </div>
  )
}

export default Button
