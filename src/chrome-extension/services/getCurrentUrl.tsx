import { MessageType } from '@/utils/constants'

type T_getCurrentUrl = () => Promise<string>

const getWithChrome: T_getCurrentUrl = () => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      { type: MessageType.RequestUrl },
      (content: string) => {
        resolve(content)
      },
    )
  })
}

const getFromHref: T_getCurrentUrl = () => {
  return new Promise(resolve => {
    resolve(window.location.href)
  })
}

const getCurrentUrl =
  process.env.NODE_ENV !== 'test' ? getWithChrome : getFromHref

let _test:
  | {
      getFromHref: T_getCurrentUrl
      getWithChrome: T_getCurrentUrl
    }
  | undefined

if (process.env.NODE_ENV === 'test') {
  _test = {
    getFromHref,
    getWithChrome,
  }
}

export { _test }

export default getCurrentUrl
