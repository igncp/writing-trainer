import React from 'react'

import { useHover } from '../../utils/hooks'

type TButton = React.FC<{
  style?: any
  onClick(): void
  children: React.ReactNode
}>

const Button: TButton = ({ onClick, children, style }) => {
  const { hovered, bind } = useHover()

  return (
    <div
      {...bind}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'inline-block',
        fontSize: 20,
        opacity: hovered ? 1 : 0.7,
        padding: 10,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default Button
