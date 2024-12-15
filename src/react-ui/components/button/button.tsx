import { CSSProperties, ReactNode, useState } from 'react'

import { useHover } from '../../utils/hooks'
import {
  COMP_TRANSITION,
  DIM_COMP_OPACITY,
  HOVERED_COMP_OPACITY,
} from '../../utils/ui'

import classes from './button.module.scss'

const noop = () => {}

export type T_ButtonProps = {
  children: ReactNode
  className?: string
  clickEffect?: boolean
  'data-tooltip-content'?: string
  'data-tooltip-id'?: string
  disabled?: boolean
  href?: string
  onClick?: (e?: unknown) => void
  onDoubleClick?: () => void
  shouldUseLink?: boolean
  style?: CSSProperties
  tabIndex?: number
  title?: string
}

const Button = ({
  children,
  className,
  clickEffect,
  disabled,
  href,
  onClick,
  onDoubleClick,
  shouldUseLink,
  style,
  tabIndex,
  title,
  ...props
}: T_ButtonProps) => {
  const { bind, hovered } = useHover()
  const [isClicked, setIsAnimating] = useState(false)

  const finalStyle = {
    backgroundColor: clickEffect ? undefined : 'var(--color-bg-dim)',
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

  const fullClassName = [
    className,
    clickEffect && isClicked ? classes.animation : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (shouldUseLink) {
    return (
      <a
        className={fullClassName}
        data-tooltip-content={props['data-tooltip-content']}
        data-tooltip-id={props['data-tooltip-id']}
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
      className={fullClassName}
      data-tooltip-content={props['data-tooltip-content']}
      data-tooltip-id={props['data-tooltip-id']}
      disabled={disabled}
      onAnimationEnd={() => {
        setIsAnimating(false)
      }}
      onClick={
        disabled
          ? noop
          : e => {
              setIsAnimating(false)
              setTimeout(() => setIsAnimating(true), 10)
              onClick?.(e)
            }
      }
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
