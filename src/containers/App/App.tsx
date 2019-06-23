import React, { useEffect, useState } from 'react'

import PanelTrigger from '#/components/PanelTrigger/PanelTrigger'
import Panel from '#/containers/Panel/Panel'
import getCurrentUrl from '#/services/getCurrentUrl'
import log from '#/services/log'
import storage from '#/services/storage'
import { STORAGE_ENABLED_PAGES_KEY } from '#/utils/constants'
import { useBodyOverflowSwitch, useTextSelection } from '#/utils/hooks'

const getIsCurrentPageEnabled = (currentUrl: string, enabledPages: string) => {
  const pagesList = enabledPages
    .split('\n')
    .map(p => p.trim())
    .filter(p => !!p)

  return pagesList.some(p => {
    const reg = new RegExp(p)

    return reg.test(currentUrl)
  })
}

type App = React.FC<{
  onAppEnabledResult?(r: boolean): void
}>

const App: App = ({ onAppEnabledResult }) => {
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [isExtensionEnabled, setIsExtensionEnabled] = useState<boolean>(false)
  const [shouldShowPanel, showPanel] = useState<boolean>(false)
  const [usedText, setUsedText] = useState<string>('')

  const updateLanguageWithStorage = async () => {
    const [enabledPages, currentUrl] = await Promise.all([
      storage.getValue(STORAGE_ENABLED_PAGES_KEY),
      getCurrentUrl(),
    ])
    const isAppEnabled = getIsCurrentPageEnabled(currentUrl, enabledPages)

    setIsExtensionEnabled(isAppEnabled)
    if (onAppEnabledResult) {
      onAppEnabledResult(isAppEnabled)
    }
    setHasLoadedStorage(true)
  }

  useEffect(() => {
    updateLanguageWithStorage().catch((e: Error) => {
      log('ERROR', e)
    })
  }, [])

  useBodyOverflowSwitch(shouldShowPanel)

  useTextSelection(isExtensionEnabled, (textSelected: string) => {
    const parsedText = textSelected.trim()

    if (parsedText !== '' && !shouldShowPanel) {
      setUsedText(parsedText)
    }
  })

  if (!hasLoadedStorage || !isExtensionEnabled) {
    return null
  }

  if (!shouldShowPanel && usedText) {
    return (
      <PanelTrigger
        onClick={() => {
          showPanel(true)
        }}
      />
    )
  } else if (!usedText) {
    return null
  }

  return (
    <Panel
      text={usedText}
      onHideRequest={() => {
        showPanel(false)
      }}
    />
  )
}

export default App
