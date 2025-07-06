import { T_Storage } from '#/chrome-extension/services/storage';

type T_getCurrentUrl = () => Promise<string>;

interface T_Services {
  getCurrentUrl: T_getCurrentUrl;
  storage: T_Storage;
}

export type { T_getCurrentUrl, T_Services };
