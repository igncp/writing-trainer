import React from 'react'

import { useHover } from '../../utils/hooks'

type TPanelCloseButton = React.FC<{
  onClick(): void
}>

const PanelCloseButton: TPanelCloseButton = ({ onClick }) => {
  const { hovered, bind } = useHover()

  return (
    <div
      {...bind}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'inline-block',
        float: 'right',
        fontSize: 20,
        opacity: hovered ? 1 : 0.7,
        padding: 10,
      }}
    >
      Hide
    </div>
  )
}

export default PanelCloseButton
