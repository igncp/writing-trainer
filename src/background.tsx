import { MessageType } from '#/utils/constants'

interface Message {
  type: MessageType
}

chrome.runtime.onMessage.addListener(
  (
    content: Message,
    sender: unknown,
    sendResponse: (v: unknown) => void
  ): boolean => {
    if (content.type === MessageType.RequestUrl) {
      chrome.tabs.query({ active: true }, tabs => {
        sendResponse(tabs[0].url)
      })

      return true
    }
  }
)
