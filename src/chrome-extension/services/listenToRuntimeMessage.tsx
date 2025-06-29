import { Message } from '@/utils/constants';

type T_sendResponse = (v: unknown) => void;

type T_Listener = (
  m: Message,
  sender: unknown,
  sendResponse: T_sendResponse,
) => void;

type T_listenToRuntimeMessage = (fn: T_Listener) => void;

const listenReal: T_listenToRuntimeMessage = (fn: T_Listener) => {
  chrome.runtime.onMessage.addListener(fn);
};

const listenFake: T_listenToRuntimeMessage = () => {};

const listenToRuntimeMessage =
  process.env.NODE_ENV === 'production' ? listenReal : listenFake;

export default listenToRuntimeMessage;
