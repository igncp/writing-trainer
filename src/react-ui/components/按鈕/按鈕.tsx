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
  title?: string
}

const 按鈕 = ({
  children,
  className,
  disabled,
  href,
  onClick,
  onDoubleClick,
  shouldUseLink,
  style,
  title,
}: T_ButtonProps) => {
  const { bind, hovered } = useHover()
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
    <div
      {...bind}
      onClick={disabled ? noop : onClick}
      onDoubleClick={disabled ? noop : onDoubleClick}
      role="button"
      style={finalStyle}
      title={title}
    >
      {children}
    </div>
  )
}

export default 按鈕
