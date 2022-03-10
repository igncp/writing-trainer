import React, { useEffect, useState } from 'react'
import Panel from 'writing-trainer-react-ui/dist/containers/Panel/Panel'
import PanelBase from 'writing-trainer-react-ui/dist/components/PanelBase/PanelBase'
import {
  useBodyOverflowSwitch,
  useTextSelection,
} from 'writing-trainer-react-ui/dist/utils/hooks'
import { LanguageUIManager } from 'writing-trainer-react-ui/dist/languages/languageUIManager'
import { LanguageManager } from 'writing-trainer-core'

import PanelTrigger from '#/components/PanelTrigger/PanelTrigger'
import getCurrentUrl from '#/services/getCurrentUrl'
import listenToRuntimeMessage from '#/services/listenToRuntimeMessage'
import log from '#/services/log'
import storage from '#/services/storage'
import {
  Message,
  MessageType,
  STORAGE_ENABLED_PAGES_KEY,
} from '#/utils/constants'

const languageManager = new LanguageManager()
const languageUIManager = new LanguageUIManager(languageManager)
languageUIManager.init()

const panelServices = { getCurrentUrl, storage }

const getIsCurrentPageEnabled = (currentUrl: string, enabledPages: string) => {
  const pagesList = enabledPages
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => !!p)

  return pagesList.some((p) => {
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

  const hidePanel = () => {
    showPanel(false)
  }

  return (
    <PanelBase onOverlayClick={hidePanel}>
      <Panel
        languageManager={languageManager}
        languageUIManager={languageUIManager}
        onHideRequest={hidePanel}
        services={panelServices}
        text={usedText}
      />
    </PanelBase>
  )
}

export default Content
