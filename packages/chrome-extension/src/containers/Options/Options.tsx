import React, { useEffect, useState } from 'react'

import Button from '#/components/Button/Button'
import TextArea from '#/components/TextArea/TextArea'
import storage from '#/services/storage'
import { STORAGE_ENABLED_PAGES_KEY } from '#/utils/constants'

type T_Wrapper = React.FC<{ children: React.ReactNode }>

const SpanWrapper: T_Wrapper = ({ children }) => <span>{children}</span>
const BWrapper: T_Wrapper = ({ children }) => <b>{children}</b>

type Options = React.FC

const Options: Options = () => {
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [enabledPagesValue, setEnabledPagesValue] = useState<string>('')
  const [savedEnabledPagesValue, setSavedEnabledPagesValue] = useState<string>(
    ''
  )

  const updateLanguageWithStorage = async () => {
    const enabledPages = await storage.getValue(STORAGE_ENABLED_PAGES_KEY)

    if (enabledPages) {
      setEnabledPagesValue(enabledPages)
      setSavedEnabledPagesValue(enabledPages)
    }
    setHasLoadedStorage(true)
  }

  useEffect(() => {
    updateLanguageWithStorage().catch(() => {})
  }, [])

  const handleEnabledPagesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEnabledPagesValue(e.target.value)
  }

  const handleSave = () => {
    storage.setValue(STORAGE_ENABLED_PAGES_KEY, enabledPagesValue)
    setSavedEnabledPagesValue(enabledPagesValue)
  }

  if (!hasLoadedStorage) {
    return null
  }

  const Wrapper: T_Wrapper =
    savedEnabledPagesValue === enabledPagesValue ? SpanWrapper : BWrapper

  return (
    <div>
      <p>
        Pages where it is enabled. Use a regex on each line.{' '}
        <Wrapper>Don't forget to save.</Wrapper>
      </p>
      <Button onClick={handleSave}>Save</Button>
      <TextArea
        defaultValue={enabledPagesValue}
        onChange={handleEnabledPagesChange}
        rows={20}
      />
    </div>
  )
}

export default Options
