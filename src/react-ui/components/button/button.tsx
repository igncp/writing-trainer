import { CSSProperties, ReactNode } from 'react'

import { useHover } from '../../utils/hooks'
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '../../utils/ui'

const noop = () => {}

export type T_ButtonProps = {
  children: ReactNode
  className?: string
  disabled?: boolean
  href?: string
  onClick?: () => void
  onDoubleClick?: () => void
  shouldUseLink?: boolean
  style?: CSSProperties
  tabIndex?: number
  title?: string
}

const Button = ({
  children,
  className,
  disabled,
  href,
  onClick,
  onDoubleClick,
  shouldUseLink,
  style,
  tabIndex,
  title,
}: T_ButtonProps) => {
  const { bind, hovered } = useHover()
  const finalStyle = {
    backgroundColor: 'var(--color-bg-dim)',
    border: '0',
    boxShadow: '0 0 5px 0.1px var(--color-text)',
    color: 'var(--color-text, "black")',
    cursor: disabled ?? !onClick ? 'default' : 'pointer',
    display: 'inline-block',
    fontSize: 20,
    opacity: hovered && !disabled ? HOVERED_COMP_OPACITY : DIM_COMP_OPACITY,
    padding: 10,
    textDecoration: 'none',
    textShadow: disabled ? '1px 1px 5px blue' : '',
    transition: COMP_TRANSITION,
    userSelect: 'none',
    ...style,
  } as const

  if (shouldUseLink) {
    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        style={finalStyle}
        target="_blank"
        title={title}
        {...bind}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      {...bind}
      className={className}
      onClick={disabled ? noop : onClick}
      onDoubleClick={disabled ? noop : onDoubleClick}
      role="button"
      style={finalStyle}
      tabIndex={tabIndex}
      title={title}
    >
      {children}
    </button>
  )
}

export default Button
