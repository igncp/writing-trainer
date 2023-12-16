import React, { useEffect, useState } from 'react'

import { T_OptionsBlock } from '../../types'

const OptionsBlock: T_OptionsBlock = ({ onOptionsChange, languageOptions }) => {
  const [tonesValue, setTonesValue] = useState(
    (languageOptions.tonesValue as string) || 'without-tones',
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionsChange = (newValues: any) => {
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
