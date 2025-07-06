import { MessageType } from '@/utils/constants';
import { T_getCurrentUrl } from '#/react-ui/typings/mainTypes';

const getWithChrome: T_getCurrentUrl = () =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: MessageType.RequestUrl },
      (content: string) => {
        resolve(content);
      },
    );
  });

const getFromHref: T_getCurrentUrl = () =>
  new Promise((resolve) => {
    resolve(window.location.href);
  });

const getCurrentUrl =
  process.env.NODE_ENV !== 'test' ? getWithChrome : getFromHref;

let _test:
  | {
      getFromHref: T_getCurrentUrl;
      getWithChrome: T_getCurrentUrl;
    }
  | undefined;

if (process.env.NODE_ENV === 'test') {
  _test = {
    getFromHref,
    getWithChrome,
  };
}

export { _test };

export default getCurrentUrl;
