type T_openOptionsPage = () => void

const openReal: T_openOptionsPage = () => {
  chrome.tabs.create({
    url: `chrome-extension://${chrome.runtime.id}/html/options.html`,
  })
}

const openFake: T_openOptionsPage = () => {}

const openOptionsPage = __USE_CHROME_TABS_FEATURE__ ? openReal : openFake

export default openOptionsPage
