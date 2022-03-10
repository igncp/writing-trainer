import { constants } from 'writing-trainer-core'

const chromeSetValue = (key: string, value: string) => {
  chrome.storage.local.set({ [key]: value })
}

const chromeGetValue = (key: string): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
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

const localStorageSetValue = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

const localStorageGetValue = (key: string): Promise<string> => {
  const result = localStorage.getItem(key) || ''

  return Promise.resolve(result)
}

const getValueMap = {
  chrome: chromeGetValue,
  dummy: dummyGetValue,
  localStorage: localStorageGetValue,
}

const setValueMap = {
  chrome: chromeSetValue,
  dummy: dummySetValue,
  localStorage: localStorageSetValue,
}

const storage: constants.T_Storage = {
  getValue: getValueMap[__STORAGE_TYPE__],
  setValue: setValueMap[__STORAGE_TYPE__],
}

export default storage
