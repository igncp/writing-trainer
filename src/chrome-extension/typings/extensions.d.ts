declare module '*.csv' {
  declare const list: string[][]

  export default list
}

declare module '*.txt' {
  declare const value: string

  export default value
}

declare let __STORAGE_TYPE__: 'chrome' | 'dummy' | 'localStorage'
