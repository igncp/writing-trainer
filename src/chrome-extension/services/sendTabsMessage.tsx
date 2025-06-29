import { Message } from '@/utils/constants';

type T_sendTabsMessage = (msg: Message) => Promise<boolean>;

const sendReal: T_sendTabsMessage = (msg) =>
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (!tabs.length) {
        resolve(false);

        return;
      }

      chrome.tabs.sendMessage(tabs[0].id as number, msg, (val: boolean) => {
        resolve(val);
      });
    });
  });

const sendFake: T_sendTabsMessage = () => Promise.resolve(true);

const sendTabsMessage =
  process.env.NODE_ENV === 'production' ? sendReal : sendFake;

export default sendTabsMessage;
