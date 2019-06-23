import { Message, MessageType } from '#/utils/constants'

chrome.runtime.onMessage.addListener(
  (
    content: Message,
    sender: unknown,
    sendResponse: (v: unknown) => void
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
