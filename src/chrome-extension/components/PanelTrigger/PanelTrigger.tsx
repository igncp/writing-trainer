import { useHover } from '#/react-ui'
import { FC } from 'react'

type T_PanelTrigger = FC<{
  onClick: () => void
}>

const PanelTrigger: T_PanelTrigger = ({ onClick }) => {
  const { bind, hovered } = useHover()

  return (
    <div
      {...bind}
      onClick={onClick}
      style={{
        background: `rgba(255, 255, 255, ${hovered ? '1' : '0.5'})`,
        border: '1px solid black',
        borderRadius: '5px',
        cursor: 'pointer',
        padding: '10px',
        position: 'fixed',
        right: '0',
        top: '0',
        transition: 'all linear 1s',
        zIndex: 9999999999,
      }}
    >
      Open Writing Trainer
    </div>
  )
}

export default PanelTrigger
