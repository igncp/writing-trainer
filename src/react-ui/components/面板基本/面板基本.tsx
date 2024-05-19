import { ReactNode } from 'react'

type 特性 = {
  children: ReactNode
  覆蓋點擊: () => void
}

const 面板基本 = ({ children, 覆蓋點擊 }: 特性) => {
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
        onClick={覆蓋點擊}
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

export default 面板基本
