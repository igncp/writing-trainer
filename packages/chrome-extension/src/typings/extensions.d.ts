declare module '*.csv' {
  declare const list: string[][]

  export default list
}

declare module '*.txt' {
  declare const value: string

  export default value
}

declare let __STORAGE_TYPE__: 'dummy' | 'chrome' | 'localStorage'
declare let __USE_CHROME_TABS_FEATURE__: boolean
declare let __TEST__: boolean
