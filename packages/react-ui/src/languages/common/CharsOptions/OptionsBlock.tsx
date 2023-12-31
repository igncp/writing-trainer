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

  const handleTonesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTonesValue(e.target.value)

    handleOptionsChange({
      tonesValue: e.target.value,
    })
  }

  const handlePlaymodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaymodeValue(e.target.value)

    handleOptionsChange({
      playmodeValue: e.target.value,
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
            checked={languageOptions.autoSplitLines === false ? false : true}
            id="autoSplitLines"
            onChange={() => {
              handleOptionsChange({
                autoSplitLines:
                  languageOptions.autoSplitLines === false ? true : false,
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
