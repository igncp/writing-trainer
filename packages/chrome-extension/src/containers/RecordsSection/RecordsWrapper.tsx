import React from 'react'

import Button from '#/components/Button/Button'

type RecordsWrapper = React.FC<{
  onRecordsClose(): void
  children: React.ReactNode
}>

const RecordsWrapper: RecordsWrapper = ({ onRecordsClose, children }) => {
  return (
    <div>
      <Button onClick={onRecordsClose}>Close</Button>
      <div>{children}</div>
    </div>
  )
}

export default RecordsWrapper
