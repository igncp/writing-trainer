import React from 'react'

type T_PanelBase = React.FC<{
  children: React.ReactNode
  onOverlayClick(): void
}>

const PanelBase: T_PanelBase = ({ children, onOverlayClick }) => {
  return (
    <div
      style={{
        bottom: 0,
        left: 0,
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 9999999,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,1)',
          border: '1px solid black',
          left: 0,
          margin: 10,
          position: 'absolute',
          right: 0,
          zIndex: 2,
        }}
      >
        {children}
      </div>
      <div
        onClick={onOverlayClick}
        style={{
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1,
        }}
      />
    </div>
  )
}

export default PanelBase
