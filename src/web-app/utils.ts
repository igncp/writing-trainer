import { T_Storage } from '#/chrome-extension/services/storage';

import { siteUrl } from './constants';

const usedText = '忘掉種過的花, 重新的出發, 放棄理想吧';

const getCurrentUrl = () => Promise.resolve(siteUrl);

const storage: T_Storage = {
  getValue: (key: string) => Promise.resolve(localStorage.getItem(key) ?? ''),
  setValue: (key: string, value: string) => localStorage.setItem(key, value),
};

const panelServices = {
  getCurrentUrl,
  storage,
};

export { panelServices, usedText };
