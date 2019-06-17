declare module '*.csv' {
  declare const list: Array<Array<string>>

  export default list
}

declare module '*.txt' {
  declare const value: string

  export default value
}

declare var __STORAGE_TYPE__: 'dummy' | 'chrome' | 'localStorage'
declare var __TEST__: boolean
