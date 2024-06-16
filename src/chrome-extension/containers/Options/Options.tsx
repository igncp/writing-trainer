import { Button, 文字區 } from '#/react-ui'
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react'

import storage from '@/services/storage'
import { STORAGE_ENABLED_PAGES_KEY } from '@/utils/constants'

type T_Wrapper = FC<{ children: ReactNode }>

const SpanWrapper: T_Wrapper = ({ children }) => <span>{children}</span>
const BWrapper: T_Wrapper = ({ children }) => <b>{children}</b>

const Options = () => {
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [enabledPagesValue, setEnabledPagesValue] = useState<string>('')
  const [savedEnabledPagesValue, setSavedEnabledPagesValue] =
    useState<string>('')

  const updateLanguageWithStorage = async () => {
    const enabledPages = await storage.getValue(STORAGE_ENABLED_PAGES_KEY)

    if (enabledPages) {
      setEnabledPagesValue(enabledPages)
      setSavedEnabledPagesValue(enabledPages)
    }
    setHasLoadedStorage(true)
  }

  useEffect(() => {
    updateLanguageWithStorage().catch(error => {
      console.log(error)
    })
  }, [])

  const handleEnabledPagesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
        啟用它的頁面。 在每行上使用正規表示式。 <Wrapper>別忘了保存。</Wrapper>
      </p>
      <Button onClick={handleSave}>儲存</Button>
      <文字區
        defaultValue={enabledPagesValue}
        onChange={handleEnabledPagesChange}
        rows={20}
      />
    </div>
  )
}

export default Options
