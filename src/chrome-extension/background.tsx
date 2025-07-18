import listenToRuntimeMessage from '@/services/listenToRuntimeMessage';
import { Message, MessageType } from '@/utils/constants';

listenToRuntimeMessage(
  (content: Message, _sender: unknown, sendResponse: (v: string) => void) => {
    if (content.type === MessageType.RequestUrl) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (!tabs.length) {
          sendResponse('');

          return;
        }

        sendResponse(tabs[0].url as string);
      });

      return true;
    }
  },
);

// this enables the popup
chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.pageAction.show(tabId);
});
