import React from 'react'

import { useHover } from '../../utils/hooks'
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '../../utils/ui'

const noop = () => {}

export type T_ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  href?: string
  onClick?(): void
  shouldUseLink?: boolean
  style?: React.CSSProperties
}

type T_Button = React.FC<T_ButtonProps>

const Button: T_Button = ({
  children,
  disabled,
  href,
  onClick,
  shouldUseLink,
  style,
}) => {
  const { hovered, bind } = useHover()
  const finalStyle = {
    color: 'black',
    cursor: disabled ? 'default' : 'pointer',
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
