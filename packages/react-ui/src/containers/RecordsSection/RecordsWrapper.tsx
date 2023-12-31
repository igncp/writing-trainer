import React from 'react'

import Button from '../../components/Button/Button'

type IProps = {
  children: React.ReactNode
  onRecordsClose: () => void
}

const RecordsWrapper = ({ children, onRecordsClose }: IProps) => {
  return (
    <div>
      <Button onClick={onRecordsClose}>Close</Button>
      <div>{children}</div>
    </div>
  )
}

export default RecordsWrapper
