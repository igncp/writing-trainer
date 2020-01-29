import listenToRuntimeMessage from '#/services/listenToRuntimeMessage'
import { Message, MessageType } from '#/utils/constants'

listenToRuntimeMessage(
  (
    content: Message,
    sender: unknown,
    sendResponse: (v: string) => void
  ): boolean => {
    if (content.type === MessageType.RequestUrl) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (!tabs.length) {
          sendResponse('')

          return
        }

        sendResponse(tabs[0].url)
      })

      return true
    }
  }
)

// this enables the popup
chrome.tabs.onUpdated.addListener(tabId => {
  chrome.pageAction.show(tabId)
})
