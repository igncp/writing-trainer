const chromeSetValue = (key: string, value: string) => {
  chrome.storage.local.set({ [key]: value })
}
const chromeGetValue = (key: string): Promise<string> => {
  return new Promise(resolve => {
    chrome.storage.local.get([key], result => {
      if (typeof result[key] === 'string') {
        resolve(result[key])

        return
      }

      resolve('')
    })
  })
}

const dummySetValue = () => {}
const dummyGetValue = () => Promise.resolve('')

interface Storage {
  setValue(key: string, value: string): void
  getValue(key: string): Promise<string>
}

const storage: Storage = {
  getValue: __USE_CHROME_API__ ? chromeGetValue : dummyGetValue,
  setValue: __USE_CHROME_API__ ? chromeSetValue : dummySetValue,
}

export default storage
