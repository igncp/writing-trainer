import { Message } from '@/utils/constants'

type T_sendTabsMessage = (msg: Message) => Promise<boolean>

const sendReal: T_sendTabsMessage = msg => {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      if (!tabs.length) {
        resolve(false)

        return
      }

      chrome.tabs.sendMessage(tabs[0].id as number, msg, (val: boolean) => {
        resolve(val)
      })
    })
  })
}

const sendFake: T_sendTabsMessage = () => {
  return Promise.resolve(true)
}

const sendTabsMessage = __USE_CHROME_TABS_FEATURE__ ? sendReal : sendFake

export default sendTabsMessage
