import React from 'react'

import Button from '../../components/Button/Button'

type IProps = {
  onRecordsClose: () => void
  children: React.ReactNode
}

const RecordsWrapper = ({ onRecordsClose, children }: IProps) => {
  return (
    <div>
      <Button onClick={onRecordsClose}>Close</Button>
      <div>{children}</div>
    </div>
  )
}

export default RecordsWrapper
