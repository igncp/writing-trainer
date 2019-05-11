import React, { useEffect, useState } from 'react'

const OptionsBlock: React.FC<{
  onOptionsChange: Function
}> = ({ onOptionsChange }) => {
  const [tonesValue, setTonesValue] = useState('without-tones')

  const handleOptionsChange = (newValues: {}) => {
    onOptionsChange({
      newTonesValue: tonesValue,
      ...newValues,
    })
  }

  const handleTonesChange = (e: any) => {
    setTonesValue(e.target.value)

    handleOptionsChange({
      newTonesValue: e.target.value,
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
