import { Message } from '#/utils/constants'

type T_sendResponse = (v: unknown) => void
type TListener = (
  m: Message,
  sender: unknown,
  sendResponse: T_sendResponse
) => void
type T_listenToRuntimeMessage = (fn: TListener) => void

const listenReal: T_listenToRuntimeMessage = (fn: TListener) => {
  chrome.runtime.onMessage.addListener(fn)
}

const listenFake: T_listenToRuntimeMessage = () => {}

const listenToRuntimeMessage = __USE_CHROME_TABS_FEATURE__
  ? listenReal
  : listenFake

export default listenToRuntimeMessage
