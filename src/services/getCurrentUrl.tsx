import { MessageType } from '#/utils/constants'

type T_getCurrentUrl = () => Promise<string>

const getWithChrome: T_getCurrentUrl = () => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      { type: MessageType.RequestUrl },
      (content: string) => {
        resolve(content)
      }
    )
  })
}

const getFromHref: T_getCurrentUrl = () => {
  return new Promise(resolve => {
    resolve(window.location.href)
  })
}

const getCurrentUrl = __USE_CHROME_TABS_FEATURE__ ? getWithChrome : getFromHref

export default getCurrentUrl
