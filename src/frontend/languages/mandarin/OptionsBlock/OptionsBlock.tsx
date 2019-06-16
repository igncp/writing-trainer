import React, { useEffect, useState } from 'react'

import { TOptionsBlock } from '#/languages/types'

const OptionsBlock: TOptionsBlock = ({ onOptionsChange }) => {
  const [tonesValue, setTonesValue] = useState('without-tones')

  const handleOptionsChange = (newValues: {}) => {
    onOptionsChange({
      tonesValue,
      ...newValues,
    })
  }

  const handleTonesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTonesValue(e.target.value)

    handleOptionsChange({
      tonesValue: e.target.value,
    })
  }

  useEffect(() => {
    handleOptionsChange({})
  }, [])

  return (
    <div>
      <select onChange={handleTonesChange} value={tonesValue}>
        <option value="without-tones">Without Tones</option>
        <option value="with-tones">With Tones</option>
      </select>
    </div>
  )
}

export default OptionsBlock
