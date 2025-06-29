type T_openOptionsPage = () => void;

const openReal: T_openOptionsPage = () => {
  void chrome.tabs.create({
    url: `chrome-extension://${chrome.runtime.id}/html/options.html`,
  });
};

const openFake: T_openOptionsPage = () => {};

const openOptionsPage =
  process.env.NODE_ENV === 'production' ? openReal : openFake;

export default openOptionsPage;
