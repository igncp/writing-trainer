import React from 'react'

type TPanelBase = React.FC<{
  children: React.ReactNode
}>

const PanelBase: TPanelBase = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.6)',
        border: '1px solid black',
        left: 10,
        position: 'fixed',
        right: 10,
        top: 10,
        zIndex: 9999999,
      }}
    >
      {children}
    </div>
  )
}

export default PanelBase
