import React, { useEffect, useState } from 'react'

import { T_OptionsBlock } from '../../types'

const OptionsBlock: T_OptionsBlock = ({ languageOptions, onOptionsChange }) => {
  const [tonesValue, setTonesValue] = useState(
    (languageOptions.tonesValue as string) || 'without-tones',
  )
  const [playmodeValue, setPlaymodeValue] = useState(
    (languageOptions.playmodeValue as string) || 'reductive',
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionsChange = (newValues: any) => {
    onOptionsChange({
      playmodeValue,
      tonesValue,

      ...newValues,
    })
  }

  const handleTonesChange = (事件: React.ChangeEvent<HTMLSelectElement>) => {
    setTonesValue(事件.target.value)

    handleOptionsChange({
      tonesValue: 事件.target.value,
    })
  }

  const handlePlaymodeChange = (事件: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaymodeValue(事件.target.value)

    handleOptionsChange({
      playmodeValue: 事件.target.value,
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
      <select onChange={handlePlaymodeChange} value={playmodeValue}>
        <option value="reductive">Reductive</option>
        <option value="repetitive">Repetitive</option>
      </select>
      <span style={{ marginLeft: 10 }}>
        <label htmlFor="autoSplitLines">
          Auto split lines:
          <input
            checked={!!languageOptions.autoSplitLines}
            id="autoSplitLines"
            onChange={() => {
              handleOptionsChange({
                autoSplitLines: !languageOptions.autoSplitLines,
              })
            }}
            type="checkbox"
          />
        </label>
      </span>
    </div>
  )
}

export default OptionsBlock
