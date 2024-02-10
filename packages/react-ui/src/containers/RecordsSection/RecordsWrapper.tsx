import React from 'react'

import 按鈕 from '../../components/按鈕/按鈕'

type IProps = {
  children: React.ReactNode
  onRecordsClose: () => void
}

const RecordsWrapper = ({ children, onRecordsClose }: IProps) => {
  return (
    <div>
      <按鈕 onClick={onRecordsClose}>關閉</按鈕>
      <div>{children}</div>
    </div>
  )
}

export default RecordsWrapper
