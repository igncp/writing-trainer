import React, { useEffect, useState } from 'react'

import PanelTrigger from '#/components/PanelTrigger/PanelTrigger'
import Panel from '#/containers/Panel/Panel'
import getCurrentUrl from '#/services/getCurrentUrl'
import listenToRuntimeMessage from '#/services/listenToRuntimeMessage'
import log from '#/services/log'
import storage from '#/services/storage'
import languageUIManager from '#/languages/languageUIManager'
import {
  Message,
  MessageType,
  STORAGE_ENABLED_PAGES_KEY,
} from '#/utils/constants'
import { useBodyOverflowSwitch, useTextSelection } from '#/utils/hooks'

languageUIManager.init()

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

type Content = React.FC<{
  onContentEnabledResult?(r: boolean): void
}>

const Content: Content = ({ onContentEnabledResult }) => {
  const [hasLoadedStorage, setHasLoadedStorage] = useState<boolean>(false)
  const [isExtensionEnabled, setIsExtensionEnabled] = useState<boolean>(false)
  const [shouldShowPanel, showPanel] = useState<boolean>(false)
  const [usedText, setUsedText] = useState<string>('')

  const updateLanguageWithStorage = async () => {
    const [enabledPages, currentUrl] = await Promise.all([
      storage.getValue(STORAGE_ENABLED_PAGES_KEY),
      getCurrentUrl(),
    ])
    const isContentEnabled = getIsCurrentPageEnabled(currentUrl, enabledPages)

    setIsExtensionEnabled(isContentEnabled)

    if (onContentEnabledResult) {
      onContentEnabledResult(isContentEnabled)
    }
    setHasLoadedStorage(true)
  }

  useEffect(() => {
    updateLanguageWithStorage().catch((e: Error) => {
      log('ERROR', e)
    })
  }, [])

  useEffect(() => {
    listenToRuntimeMessage((message: Message) => {
      if (message.type === MessageType.EnableOnce && !isExtensionEnabled) {
        setIsExtensionEnabled(true)

        return true
      }

      return false
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
      onHideRequest={() => {
        showPanel(false)
      }}
      text={usedText}
    />
  )
}

export default Content
